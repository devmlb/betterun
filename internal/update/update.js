document.addEventListener('DOMContentLoaded', function () {
    mdui.setColorScheme('#3452ff');

    document.querySelector('#header-title').textContent = `BetterUN a été mise à jour vers la version ${chrome.runtime.getManifest().version} !`;
});