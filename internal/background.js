/**
 * Checks if two objects are equal.
 * @param   {Object} val1 The first object.
 * @param   {Object} val2 The second object.
 * @return  {Boolean} The two objects are equal or not.
 */
function areObjectsEqual(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (!keys2.includes(key) || !areValuesEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if two values are equal.
 * @param   {String|Object|Number|Boolean} val1 The first value.
 * @param   {String|Object|Number|Boolean} val2 The second value.
 * @return  {Boolean} The two values are equal or not.
 */
function areValuesEqual(val1, val2) {
    // if both values are objects, calls the function areObjectsEqual() recursively
    if (typeof val1 === 'object' && typeof val2 === 'object') {
        return areObjectsEqual(val1, val2);
    }
    return val1 === val2;
}

/**
 * Gets mods informations from the mods file.
 * @param   {String} [modsFile='/mods.json'] The path to the mods file.
 * @return  {Object} The content of the mods file.
 */
async function getMods(modsFile = '/mods.json') {
    const modsFileContent = await fetch(chrome.runtime.getURL(modsFile));
    return modsFileContent.json();
}

/**
 * Gets the default values for the mods in the mods file.
 * @return  {Object} Pairs of mod id and its activation state.
 */
async function getModsDefault() {
    const mods = await getMods();
    const result = {};
    mods.forEach(mod => {
        if (mod.hasOwnProperty('id') && mod.hasOwnProperty('defaultState')) {
            result[mod.id] = mod.defaultState;
        }
    });
    return result;
}

/**
 * Gets only certain pairs of keys and values for each mod.
 * @param   {Array} [keys=[]] Keys to look for in mod pairs of keys and values.
 * @return  {Object} Pairs with the mod id and the content of the pairs of keys and values found.
 */
async function getModsValues(keys = []) {
    const mods = await getMods();
    const result = {};
    mods.forEach(mod => {
        let modResult = {};
        Object.keys(mod).forEach(modKey => {
            if (keys.includes(modKey)) {
                modResult[modKey] = mod[modKey];
            }
        });
        result[mod.id] = modResult;
    });
    return result;
}

function transformToRegex(pattern) {
    let escapedPattern = pattern.replace(/\//g, '\\/').replace(/\./g, '\\.'); // escaping dots and slashs
    let regexPattern = escapedPattern.replace('*', '[a-z]*');
    return regexPattern;
}

/**
 * Compares the mods and global settings and the settings corresponding to them in the extension's storage, and makes the two match.
 * @param   {Object} modsSettings   An object of each mod settings to put in the extension storage. Each mod object needs to include the enabled key.
 * @param   {Object} globalSettings An object of each global setting to put in the extension storage.
 */
async function processStorage(modsSettings, globalSettings) {
    const currentSettings = await chrome.storage.sync.get(null);
    const requiredSettings = {};
    Object.keys(modsSettings).forEach((key) => {
        requiredSettings['mod-' + key] = modsSettings[key];
    });
    Object.keys(globalSettings).forEach((key) => {
        requiredSettings['gbs-' + key] = globalSettings[key];
    });

    // cleaning out unnecessary elements from the extension's storage
    const toRemove = [];
    Object.keys(currentSettings).forEach((key) => {
        if (!requiredSettings.hasOwnProperty(key)) {
            toRemove.push(key);
        }
    });
    if (toRemove.length > 0) {
        console.log('Cleaning the extension storage: REMOVING\n' + JSON.stringify(toRemove, undefined, 2));
        chrome.storage.sync.remove(toRemove);
    }

    // adding or updating missing elements in the extension's storage
    const toAdd = {};
    Object.keys(requiredSettings).forEach((key) => {
        if (!currentSettings.hasOwnProperty(key)) {
            toAdd[key] = requiredSettings[key];
        } else {
            if (key.startsWith('mod-')) {
                let tempModSettings = requiredSettings[key];
                tempModSettings.matches = tempModSettings.matches.map(transformToRegex);
                // keeping mod activation status
                tempModSettings.enabled = currentSettings[key].enabled;
                if (!areObjectsEqual(tempModSettings, currentSettings[key])) {
                    toAdd[key] = tempModSettings;
                }
            }
        }
    });
    if (Object.keys(toAdd).length > 0) {
        console.log('Updating the extension storage: ADDING\n' + JSON.stringify(toAdd, undefined, 2));
        chrome.storage.sync.set(toAdd);
    }
};

/**
 * Initializes the extension storage.
 * @param   {String}    previousRelease    The previous release number.
 * @param   {String}    currentRelease     The current release number.
 */
async function initStorage(previousRelease, currentRelease) {
    const mods = await getModsValues(['frame', 'chromiumFiles', 'firefoxFiles', 'matches', 'enabled']);
    const generalSettings = { enabled: true };
    if (previousRelease != currentRelease) {
        generalSettings['updated'] = true;
    } else {
        generalSettings['updated'] = false;
    }
    processStorage(mods, generalSettings);
}

async function getExtensionStorage(key = null) {
    const storage = await chrome.storage.sync.get(key);
    return storage;
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
    chrome.permissions.contains({ origins: ['https://*.univ-nantes.fr/*'] }, (response) => {
        if (!response) {
            console.log('Not all permissions are granted. Opening the onboarding page.');
            chrome.tabs.create({ url: chrome.runtime.getURL('/internal/onboarding/onboarding.html') });
        }
    });
}

function matchAnyRegex(str, regexList) {
    for (let regex of regexList) {
        let regExp = (regex instanceof RegExp) ? regex : new RegExp(regex);
        if (regExp.test(str)) {
            return true;
        }
    }
    return false;
}

async function injectContent(url, tabId, frameId) {
    checkPermissions();
    const extensionStorage = await getExtensionStorage();
    const CSSToInject = [];
    const JSToInject = [];
    if (extensionStorage['gbs-enabled']) {
        Object.keys(extensionStorage).forEach(key => {
            if (key.startsWith('mod-')) {
                let mod = extensionStorage[key];
                if (matchAnyRegex(url, mod.matches) && mod.enabled) {
                    let modsFiles = mod.chromiumFiles;
                    if (isFirefox()) {
                        modsFiles = mod.firefoxFiles;
                    }
                    if (mod.frame == 'main' && frameId == 0 || mod.frame == 'all') {
                        modsFiles.forEach(fileName => {
                            if (fileName.includes('css')) {
                                CSSToInject.push(fileName);
                            } else if (fileName.includes('js')) {
                                JSToInject.push(fileName);
                            }
                        });
                    }
                }
            } // else if (key == 'gbs-updated' && extensionStorage[key] && frameId == 0) {
                // JSToInject.push('/internal/update-inject.js');
                // chrome.storage.sync.set({ 'gbs-updated': false });
                // console.log('Adding injection of update message')
            // }
        });
    }
    if (CSSToInject.length > 0) {
        console.log('Injecting CSS files in tab with id ' + tabId + ' in frame with id ' + frameId + ':\n' + JSON.stringify(CSSToInject, undefined, 2))
        chrome.scripting.insertCSS({
            target: { tabId: tabId, frameIds: [frameId] },
            files: CSSToInject
        });
    }
    if (JSToInject.length > 0) {
        console.log('Injecting JS files in tab with id ' + tabId + ' in frame with id ' + frameId + ':\n' + JSON.stringify(JSToInject, undefined, 2))
        chrome.scripting.executeScript({
            target: { tabId: tabId, frameIds: [frameId] },
            files: JSToInject
        });
    }
}

//----------------------------------------------------------------------------------------------------
// Main

// Injects mods when new frame with Nantes Université's URL is requested
chrome.webNavigation.onCommitted.addListener((details) => {
    if (details.url != undefined && details.url.includes('univ-nantes.fr')) {
        injectContent(details.url, details.tabId, details.frameId);
    }
});

// Updates settings storage when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
    checkPermissions();
    const currentVersion = chrome.runtime.getManifest().version;
    if (details.reason == 'update') {
        if (currentVersion == details.previousVersion) {
            console.warn('The previous version of the extension (' + details.previousVersion + ') and the current version (' + currentVersion + ') are identical, despite an update. Has the version been updated in the manifest?')
        } else {
            console.log('The extension has been updated, opening the update page.');
            chrome.tabs.create({ url: chrome.runtime.getURL('/internal/update/update.html') });
        }
        initStorage(details.previousVersion, currentVersion);
    } else {
        initStorage(null, null);
    }
});