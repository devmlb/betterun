function checkPermissions() {
    chrome.permissions.contains({ origins: ["https://*.univ-nantes.fr/*"] }, (response) => {
        if (!response) {
            console.log("Not all permissions are granted. Opening the onboarding page.");
            chrome.tabs.create({ url: chrome.runtime.getURL("/internal/onboarding.html") });
        }
    });
}

chrome.runtime.onInstalled.addListener((details) => {
    checkPermissions();
    const currentVersion = chrome.runtime.getManifest().version;
    if (details.reason == 'update') {
        if (currentVersion == details.previousVersion) {
            console.warn(`The previous version of the extension (${details.previousVersion}) and the current version (${currentVersion}) are identical, despite an update. Has the version been updated in the manifest?`)
        }
        initStorage(details.previousVersion, currentVersion);
    } else {
        initStorage(null, null);
    }
});