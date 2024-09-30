(function() {
    if (window.location == 'https://uncloud.univ-nantes.fr/index.php/login') {
        window.location.replace('/index.php/apps/oidc_login/oidc');
    } else if (window.location == 'https://uncloud.univ-nantes.fr/index.php/apps/files/files') {
        const logoutBtn = document.querySelector('li#logout>a');
        logoutBtn.setAttribute('href', 'https://intraetu.univ-nantes.fr/identification/logout')
    }
})();