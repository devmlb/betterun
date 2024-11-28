(function() {
    UNCLOUD_URL = 'https://madoc.univ-nantes.fr';
    const currentUrl = window.location.toString();
    if (currentUrl.startsWith(UNCLOUD_URL + '/index.php/login')) {
        window.location.replace(document.querySelector('#alternative-logins>a').href);
    } else {
        try {
            const logoutBtn = document.querySelector('li#logout>a');
            logoutBtn.setAttribute('href', 'https://intraetu.univ-nantes.fr/identification/logout')
        } catch (error) {
            console.error('[BETTERUN][uncloud-autologin] Error while trying to replace the logout URL.\n' + error);
        }   
    }
})();