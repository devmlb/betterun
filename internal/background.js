function getModsAndDefault(data) {
    // Read the available-mods.json file and extract the mods ids with their default values
    const result = {};
    data.forEach(item => {
        if (item.hasOwnProperty('id') && item.hasOwnProperty('default-state')) {
            result[item.id] = item['default-state'];
        }
    });
    return result;
}

function initStorageKeys(requiredSettings) {
    // Compare the mods present in available-mods.json and the settings corresponding to them in the browser's storage and make the two match
    chrome.storage.sync.get(null, function (localSettings) {
        let toRemove = [];
        // console.log("Local storage: " + JSON.stringify(localSettings));
        for (const key of Object.keys(localSettings)) {
            if (!requiredSettings.hasOwnProperty(key)) {
                toRemove.push(key);
            }
        }
        if (toRemove.length != 0) {
            console.log("Updating local storage: removing " + toRemove);
            chrome.storage.sync.remove(toRemove);
        }
        let toAdd = {};
        for (const key in requiredSettings) {
            if (!localSettings.hasOwnProperty(key)) {
                toAdd[key] = requiredSettings[key];
            } else if (key == "updated") {
                toAdd[key] = requiredSettings[key];
            }
        }
        if (Object.keys(toAdd).length != 0) {
            console.log("Updating local storage: adding " + JSON.stringify(toAdd));
            chrome.storage.sync.set(toAdd);
        }
    });
};

function checkSettingsStorage(previousReleaseVersion, currentReleaseVersion) {
    fetch(chrome.runtime.getURL("/available-mods.json")).then(function (response) {
        return response.json();
    }).then(function (data) {
        let settings = getModsAndDefault(data);
        settings["active-extension"] = true;
        if (previousReleaseVersion != currentReleaseVersion) {
            settings["updated"] = true;
        } else {
            settings["updated"] = false;
        }
        initStorageKeys(settings);
    });
}

function getModById(modId, modsList) {
    for (const element of modsList) {
        if (Object.values(element).includes(modId)) {
            return element;
        }
    }
    return null;
}

function isChromium() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('chrome') || userAgent.includes('chromium');
}

function isFirefox() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('firefox');
}

function checkPermissions() {
    chrome.permissions.contains({
        origins: ["https://*.itslearning.com/*"]
    }, function (response) {
        if (!response) {
            console.log("Not all permissions are granted. Opening the onboarding page.");
            chrome.tabs.create({ url: chrome.runtime.getURL("/internal/onboarding.html") });
        } else {
            console.log(response);
        }
    });
}

function injectContent(modsInfo, requiredContent, url, tabId, frameId) {
    if (frameId === 0) {
        checkPermissions();
    }
    const CSSfilesToAdd = [];
    const JSfilesToAdd = [];
    if (requiredContent["active-extension"]) {
        for (const key in requiredContent) {
            if (requiredContent[key] && key !== "active-extension" && key !== "updated") {
                const tempMod = getModById(key, modsInfo);
                // TODO: implement verification of the URLs supplied for each mod
                if (isChromium()) {
                    if (tempMod.frame == "all") {
                        for (const fileName of tempMod["chromium-files"]) {
                            if (fileName.includes("css")) {
                                CSSfilesToAdd.push(fileName);
                            } else if (fileName.includes("js")) {
                                JSfilesToAdd.push(fileName);
                            }
                        }
                    } else if (tempMod.frame == "main") {
                        if (frameId === 0) {
                            for (const fileName of tempMod["chromium-files"]) {
                                if (fileName.includes("css")) {
                                    CSSfilesToAdd.push(fileName);
                                } else if (fileName.includes("js")) {
                                    JSfilesToAdd.push(fileName);
                                }
                            }
                        } else {
                            console.log("Skipping injection of '" + tempMod.id + "' in tab with id '" + tabId + "' in frame with id '" + frameId + "' because 'frame' is set to 'main' in 'available-mods.json'")
                        }
                    }
                } else if (isFirefox()) {
                    if (tempMod.frame == "all") {
                        for (const fileName of tempMod["firefox-files"]) {
                            if (fileName.includes("css")) {
                                CSSfilesToAdd.push(fileName);
                            } else if (fileName.includes("js")) {
                                JSfilesToAdd.push(fileName);
                            }
                        }
                    } else if (tempMod.frame == "main") {
                        if (frameId === 0) {
                            for (const fileName of tempMod["firefox-files"]) {
                                if (fileName.includes("css")) {
                                    CSSfilesToAdd.push(fileName);
                                } else if (fileName.includes("js")) {
                                    JSfilesToAdd.push(fileName);
                                }
                            }
                        } else {
                            console.log("Skipping injection of '" + tempMod.id + "' in tab with id '" + tabId + "' in frame with id '" + frameId + "' because 'frame' is set to 'main' in 'available-mods.json'")
                        }
                    }
                }
            } else if (key == "updated" && requiredContent[key]) {
                if (frameId === 0) {
                    JSfilesToAdd.push("/internal/update-inject.js");
                    chrome.storage.sync.set({ updated: false });
                    console.log('Adding injection of update message')
                }
            }
        }
    }
    if (CSSfilesToAdd.length > 0) {
        console.log("Injecting CSS files '" + CSSfilesToAdd + "' in tab with id '" + tabId + "' in frame with id '" + frameId + "'")
        chrome.scripting.insertCSS({
            target: { tabId: tabId, frameIds: [frameId] },
            files: CSSfilesToAdd
        });
    }
    if (JSfilesToAdd.length > 0) {
        console.log("Injecting JS files '" + JSfilesToAdd + "' in tab with id '" + tabId + "' in frame with id '" + frameId + "'")
        chrome.scripting.executeScript({
            target: { tabId: tabId, frameIds: [frameId] },
            files: JSfilesToAdd
        });
    }
}

// Injects mods when new frame with Itslearning's URL is requested
chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.url != undefined) {
        if (details.url.includes("itslearning")) {
            fetch(chrome.runtime.getURL("/available-mods.json")).then(function (response) {
                return response.json();
            }).then(function (data) {
                chrome.storage.sync.get(null, function (localSettings) {
                    injectContent(data, localSettings, details.url, details.tabId, details.frameId);
                });
            });
        }
    }
});

// Updates settings storage when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function (details) {
    checkPermissions();
    const currentVersion = chrome.runtime.getManifest().version;
    chrome.alarms.create("updateAlarm", { delayInMinutes: 1, periodInMinutes: 1440 })
    if (details.reason == "update") {
        if (currentVersion == details.previousVersion) {
            console.warn("The previous version of the extension (" + details.previousVersion + ") and the current version (" + currentVersion + ") are identical, despite an update. Has the version been updated in the manifest?")
        }
        checkSettingsStorage(details.previousVersion, currentVersion);
    } else {
        checkSettingsStorage(null, null);
    }
});

// Checks for updates every 24 hours, and displays a badge if necessary
chrome.alarms.onAlarm.addListener((alarm) => {
    fetch('https://devmlb.github.io/itsbetter/release.json')
        .then(response => response.json())
        .then(data => {
            const latestVersion = data['latest-version'];
            const currentManifestVersion = chrome.runtime.getManifest().version
            if (latestVersion != currentManifestVersion) {
                console.log('Update available! (v' + currentManifestVersion + " > v" + latestVersion + ")");
                chrome.action.setBadgeText({ text: "!" });
                chrome.action.setBadgeTextColor({ color: [255, 255, 255, 255] });
                chrome.action.setBadgeBackgroundColor({ color: [186, 26, 26, 255] });
            }
        })
        .catch(error => {
            console.error('Error when checking for update:', error);
        });

});