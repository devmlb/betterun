document.addEventListener("DOMContentLoaded", function () {
    mdui.setColorScheme('#f47920');
    const btn = document.getElementById("permission-btn");
    const snackbar = document.getElementById("snackbar");
    btn.addEventListener("click", function() {
        chrome.permissions.request({ origins: ['https://*.itslearning.com/*'] });
        snackbar.open = true;
    });
});