import type {
    Mod,
    StoredModSettings,
    ExtensionStorage,
} from "../types/betterun";
import { areObjectsEqual } from "../utils/comparison";
import type { PublicPath } from "wxt/browser";

/**
 * Gets mods information from the mods file.
 */
async function getMods(modsFile: PublicPath = "/mods.json"): Promise<Mod[]> {
    const response = await fetch(browser.runtime.getURL(modsFile));
    return response.json();
}

/**
 * Gets only certain keys for each mod.
 */
async function getModsValues(
    keys: (keyof Mod)[] = [],
): Promise<Record<string, any>> {
    const mods = await getMods();
    const result: Record<string, any> = {};
    mods.forEach((mod) => {
        const modResult: Record<string, any> = {};
        keys.forEach((key) => {
            if (key in mod) {
                modResult[key] = mod[key];
            }
        });
        result[mod.id] = modResult;
    });
    return result;
}

function transformToRegex(pattern: string): string {
    // escaping dots and slashes, then replacing wildcard
    const escapedPattern = pattern.replace(/\//g, "\\/").replace(/\./g, "\\.");
    return escapedPattern.replace(/\*/g, ".*");
}

/**
 * Compares the mods and global settings with extension sync storage and keeps them synchronized.
 */
async function processStorage(
    modsSettings: Record<string, StoredModSettings>,
    globalSettings: Record<string, unknown>,
): Promise<void> {
    const currentSettings = (await browser.storage.sync.get(null)) as Record<
        string,
        any
    >;
    const requiredSettings: Record<string, any> = {};

    Object.keys(modsSettings).forEach((key) => {
        requiredSettings["mod-" + key] = modsSettings[key];
    });
    Object.keys(globalSettings).forEach((key) => {
        requiredSettings["gbs-" + key] = globalSettings[key];
    });

    // cleaning out unnecessary elements from extension storage
    const toRemove: string[] = [];
    Object.keys(currentSettings).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(requiredSettings, key)) {
            toRemove.push(key);
        }
    });
    if (toRemove.length > 0) {
        console.log(
            "Cleaning extension storage: REMOVING\n" +
                JSON.stringify(toRemove, undefined, 2),
        );
        await browser.storage.sync.remove(toRemove);
    }

    // adding or updating missing/changed elements in extension storage
    const toAdd: Record<string, any> = {};
    Object.keys(requiredSettings).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(currentSettings, key)) {
            toAdd[key] = requiredSettings[key];
        } else {
            if (key.startsWith("mod-")) {
                const tempModSettings = { ...requiredSettings[key] };
                tempModSettings.matches =
                    tempModSettings.matches.map(transformToRegex);
                // keep current user-configured mod activation status
                tempModSettings.enabled = currentSettings[key].enabled;
                if (!areObjectsEqual(tempModSettings, currentSettings[key])) {
                    toAdd[key] = tempModSettings;
                }
            }
        }
    });

    if (Object.keys(toAdd).length > 0) {
        console.log(
            "Updating extension storage: ADDING\n" +
                JSON.stringify(toAdd, undefined, 2),
        );
        await browser.storage.sync.set(toAdd);
    }
}

/**
 * Initializes the extension storage.
 */
async function initStorage(
    previousRelease: string | null,
    currentRelease: string | null,
): Promise<void> {
    const mods = (await getModsValues([
        "frame",
        "chromiumFiles",
        "firefoxFiles",
        "matches",
        "enabled",
    ])) as Record<string, StoredModSettings>;

    const generalSettings: Record<string, unknown> = {
        enabled: true,
        updated: previousRelease !== currentRelease,
    };

    await processStorage(mods, generalSettings);
}

async function getExtensionStorage(
    key: string | null = null,
): Promise<ExtensionStorage> {
    return (await browser.storage.sync.get(key)) as ExtensionStorage;
}

function isFirefox(): boolean {
    if (import.meta.env.FIREFOX) return true;
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("firefox");
}

async function checkPermissions(): Promise<void> {
    const granted = await browser.permissions.contains({
        origins: ["https://*.univ-nantes.fr/*"],
    });
    if (!granted) {
        console.log(
            "Not all permissions are granted. Opening the onboarding page.",
        );
        browser.tabs.create({
            url: browser.runtime.getURL("/onboarding.html"),
        });
    }
}

function matchAnyRegex(str: string, regexList: (string | RegExp)[]): boolean {
    for (const regex of regexList) {
        const regExp = regex instanceof RegExp ? regex : new RegExp(regex);
        if (regExp.test(str)) {
            return true;
        }
    }
    return false;
}

async function injectContent(
    url: string,
    tabId: number,
    frameId: number,
): Promise<void> {
    await checkPermissions();
    const extensionStorage = await getExtensionStorage();
    const CSSToInject: string[] = [];
    const JSToInject: string[] = [];

    if (extensionStorage["gbs-enabled"]) {
        Object.keys(extensionStorage).forEach((key) => {
            if (key.startsWith("mod-")) {
                const mod = extensionStorage[key] as StoredModSettings;
                if (mod && matchAnyRegex(url, mod.matches) && mod.enabled) {
                    let modsFiles = isFirefox()
                        ? mod.firefoxFiles
                        : mod.chromiumFiles;
                    if (
                        (mod.frame === "main" && frameId === 0) ||
                        mod.frame === "all"
                    ) {
                        modsFiles.forEach((fileName) => {
                            if (fileName.includes("css")) {
                                CSSToInject.push(fileName);
                            } else if (fileName.includes("js")) {
                                JSToInject.push(fileName);
                            }
                        });
                    }
                }
            }
        });
    }

    if (CSSToInject.length > 0) {
        console.log(
            `Injecting CSS files in tab ${tabId} frame ${frameId}:\n` +
                JSON.stringify(CSSToInject, undefined, 2),
        );
        await browser.scripting.insertCSS({
            target: { tabId, frameIds: [frameId] },
            files: CSSToInject,
        });
    }

    if (JSToInject.length > 0) {
        console.log(
            `Injecting JS files in tab ${tabId} frame ${frameId}:\n` +
                JSON.stringify(JSToInject, undefined, 2),
        );
        await browser.scripting.executeScript({
            target: { tabId, frameIds: [frameId] },
            files: JSToInject as any,
        });
    }
}

export default defineBackground(() => {
    // Injects mods when new frame with Nantes Université's URL is requested
    browser.webNavigation.onCommitted.addListener((details) => {
        if (
            details.url !== undefined &&
            details.url.includes("univ-nantes.fr")
        ) {
            injectContent(details.url, details.tabId, details.frameId);
        }
    });

    // Updates settings storage when the extension is installed or updated
    browser.runtime.onInstalled.addListener((details) => {
        checkPermissions();
        const currentVersion = browser.runtime.getManifest().version;
        if (details.reason === "update") {
            if (currentVersion === details.previousVersion) {
                console.warn(
                    `The previous version (${details.previousVersion}) and current version (${currentVersion}) are identical, despite an update. Has version been bumped?`,
                );
            } else {
                console.log("Extension updated, opening update page.");
                browser.tabs.create({
                    url: browser.runtime.getURL("/update.html"),
                });
            }
            initStorage(details.previousVersion ?? null, currentVersion);
        } else {
            initStorage(null, null);
        }
    });
});
