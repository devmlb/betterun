function isFirefox() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("firefox");
}

async function checkPermissions() {
    console.log("Checking permissions...");
    const result = await chrome.permissions.contains({ origins: ["https://*.univ-nantes.fr/*"] });
    if (!result) {
        console.log("Not all permissions are granted. Opening the onboarding page.");
        chrome.tabs.create({ url: chrome.runtime.getURL("/internal/onboarding.html") });
    }
}

async function registerEnabledScripts() {
    await chrome.scripting.unregisterContentScripts();
    const scripts = [];
    const enabledModsIds = (await chrome.storage.sync.get(["internal"])).internal.mods.enabled;
    const modsInfos = (await chrome.storage.local.get(["mods"])).mods;
    for (const modId of enabledModsIds) {
        scripts.push({
            id: modId,
            js: (isFirefox() ? modsInfos[modId].firefoxFiles : modsInfos[modId].chromiumFiles).filter(file => file.endsWith(".js")),
            persistAcrossSessions: true,
            matches: modsInfos[modId].matches,
            runAt: "document_start",
            allFrames: !modsInfos[modId].matches.mainFrameOnly,
            world: "MAIN"
        });
    }
    await chrome.scripting.registerContentScripts(scripts);
}

function validateModManifest(manifest) {
    // Pass 1: checking that all the required keys are present
    const requiredKeys = [
        "id",
        "title",
        "desc",
        "credits",
        "chromiumFiles",
        "firefoxFiles",
        "matches",
        "settings",
        "version",
        "mainFrameOnly",
        "enabledByDefault",
        "pageId",
        "sectionId"
    ];
    const unknownKeys = [];
    for (const key of Object.keys(manifest)) {
        if (requiredKeys.includes(key)) {
            requiredKeys.splice(requiredKeys.indexOf(key), 1);
        } else {
            unknownKeys.push(key)
        }
    }
    if (requiredKeys.length > 0) {
        throw new Error(`missing-keys:${JSON.stringify(requiredKeys)}`);
    } else if (unknownKeys.length > 0) {
        throw new Error(`unknown-keys:${JSON.stringify(unknownKeys)}`);
    }

    // const oneLevelKeys = {
    //     id: "string",
    //     title: "string",
    //     desc: "string",
    //     version: "string",
    //     mainFrameOnly: "boolean",
    //     enabledByDefault: "boolean",
    //     pageId: "string",
    //     sectionId: "string"
    // }

    // for (const key of Object.keys(manifest)) {
    //     if (oneLevelKeys[key]) {
    //         if (typeof manifest[key] !== oneLevelKeys[key]) {
    //             throw new Error(key);
    //         }
    //     }
    // }

    // TODO: deep checks (type...)
}

async function initLocalStorage(modsManifests, pagesStructure) {
    await chrome.storage.local.clear();
    const builtData = {
        pages: {},
        mods: {}
    };

    for (const page of pagesStructure) {
        builtData.pages[page.id] = structuredClone(page);
        delete builtData.pages[page.id].id;
        builtData.pages[page.id].sections = {};
        for (const section of page.sections) {
            builtData.pages[page.id].sections[section.id] = {
                title: section.title,
                mods: []
            }
        }
    }

    for (const modManifest of modsManifests) {
        builtData.mods[modManifest.id] = structuredClone(modManifest);
        delete builtData.mods[modManifest.id].id;
        builtData.pages[modManifest.pageId].sections[modManifest.sectionId].mods.push(modManifest.id);
    }

    await chrome.storage.local.set(builtData);
}

async function initSyncStorage(modsManifests) {
    const oldData = (await chrome.storage.sync.get()).internal;
    await chrome.storage.sync.clear();
    const newData = {
        settings: {},
        mods: {
            enabled: [],
            settings: {}
        }
    };

    // Tries to import the global setting "enabled" from old data
    try {
        newData.settings.enabled = oldData.settings.enabled;
    } catch {
        newData.settings.enabled = true; // default
    }

    // Tries to import mods settings from old data
    for (const modManifest of modsManifests) {
        // Tries to import the mod activation status
        try {
            if (oldData.mods.settings[modManifest.id] && oldData.mods.enabled.includes(modManifest.id)) {
                newData.mods.enabled.push(modManifest.id);
            }
        } catch {
            if (modManifest.enabledByDefault) { // default from manifest
                newData.mods.enabled.push(modManifest.id);
            }
        }
        // Tries to import the mod settings
        newData.mods.settings[modManifest.id] = {};
        for (const setting of modManifest.settings) {
            try {
                if (typeof setting.default === typeof oldData.mods.settings[modManifest.id][setting.id]) {
                    newData.mods.settings[modManifest.id][setting.id] = oldData.mods.settings[modManifest.id][setting.id];
                } else {
                    throw new Error();
                }
            } catch {
                newData.mods.settings[modManifest.id][setting.id] = setting.default;
            }
        }
    }

    await chrome.storage.sync.set({
        internal: newData
    });
}

async function initStorage() {
    console.log("Initializing the extension storage...");
    const modsIds = await (await fetch(chrome.runtime.getURL("/mods.json"))).json();
    const modsManifests = [];
    for (const modId of modsIds) {
        const modManifest = await (await fetch(chrome.runtime.getURL(`/mods/${modId}/manifest.json`))).json();
        try {
            validateModManifest(modManifest);
            modsManifests.push(modManifest);
        } catch (error) {
            const stringError = error.toString().replace("Error: ", "");
            if (stringError.startsWith("missing-keys")) {
                console.error(`Keys '${JSON.parse(stringError.replace("missing-keys:", "")).join("', '")}' are missing from the '${modId}' mod manifest. Skipping.`);
            } else if (stringError.startsWith("unknown-keys")) {
                console.error(`Unknown keys '${JSON.parse(stringError.replace("unknown-keys:", "")).join("', '")}' found in the '${modId}' mod manifest. Skipping.`);
            }
        }
    }
    const pagesStructure = await (await fetch(chrome.runtime.getURL("/structure.json"))).json();

    console.log("Updating sync storage...");
    await initSyncStorage(modsManifests);
    console.log("Updating local storage...");
    await initLocalStorage(modsManifests, pagesStructure);
}

chrome.runtime.onInstalled.addListener(async (details) => {
    checkPermissions();
    await initStorage();
    await registerEnabledScripts();
    const currentVersion = chrome.runtime.getManifest().version;
    if (details.reason === "update") {
        if (currentVersion !== details.previousVersion) {
            console.log("The extension has been updated. Opening the update page.");
            chrome.tabs.create({ url: chrome.runtime.getURL("/internal/update/update.html") });
        }
    }
});