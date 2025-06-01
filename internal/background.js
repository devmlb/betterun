function checkPermissions() {
    chrome.permissions.contains({ origins: ["https://*.univ-nantes.fr/*"] }, (response) => {
        if (!response) {
            console.log("Not all permissions are granted. Opening the onboarding page.");
            chrome.tabs.create({ url: chrome.runtime.getURL("/internal/onboarding.html") });
        }
    });
}

async function registerEnabledScripts() {
    await chrome.scripting.unregisterContentScripts();

}

function isModManifestValid(manifest) {
    return true;
}

async function initLocalStorage(modsManifests, pagesStructure) {
    await chrome.storage.local.clear();
    const builtData = {
        pages: {},
        mods: {}
    };

    for (const page of pagesStructure) {
        console.log(page)
        builtData.pages[page.id] = structuredClone(page);
        delete builtData.pages[page.id].id;
        builtData.pages[page.id].sections = {};
        console.log(page.sections)
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
                if (typeof(setting.default) === typeof(oldData.mods.settings[modManifest.id][setting.id])) {
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
    const modsIds = await (await fetch(chrome.runtime.getURL("/mods.json"))).json();
    const modsManifests = [];
    for (const modId of modsIds) {
        const modManifest = await (await fetch(chrome.runtime.getURL(`/mods/${modId}/manifest.json`))).json();
        if (isModManifestValid(modManifest)) {
            modsManifests.push(modManifest);
        } else {
            console.error(`Invalid manifest found for mod with id '${modId}'. Skipping.`);
        }
    }
    const pagesStructure = await (await fetch(chrome.runtime.getURL("/structure.json"))).json();

    initSyncStorage(modsManifests);
    initLocalStorage(modsManifests, pagesStructure);


    // chrome.scripting
    //     .registerContentScripts([{
    //         id: "session-script",
    //         css: ["internal/test-style.css"],
    //         persistAcrossSessions: false,
    //         matches: ["https://cas6n.univ-nantes.fr/*"],
    //         runAt: "document_start",
    //     }])
    //     .then(() => console.log("registration complete"))
    //     .catch((err) => console.warn("unexpected error", err))
}

chrome.runtime.onInstalled.addListener(async (details) => {
    checkPermissions();
    await initStorage();
    const currentVersion = chrome.runtime.getManifest().version;
    if (details.reason === "update") {
        if (currentVersion === details.previousVersion) {
            console.warn(`The previous version of the extension (${details.previousVersion}) and the current version (${currentVersion}) are identical, despite an update. Has the version been updated in the manifest?`);
        } else {
            console.log("The extension has been updated. Opening the update page.");
            chrome.tabs.create({ url: chrome.runtime.getURL("/internal/update/update.html") });
        }
        // initStorage(details.previousVersion, currentVersion);
    } else {
        // initStorage(null, null);
    }
});