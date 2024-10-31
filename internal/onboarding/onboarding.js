document.addEventListener('DOMContentLoaded', function () {
    mdui.setColorScheme('#3452ff');
    const btn = document.getElementById('permission-btn');
    const snackbar = document.getElementById('snackbar');
    btn.addEventListener('click', function() {
        chrome.permissions.request({ origins: ['https://*.univ-nantes.fr/*'] });
        snackbar.open = true;
    });
});