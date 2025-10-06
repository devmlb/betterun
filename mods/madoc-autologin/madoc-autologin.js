(function () {
    MADOC_URL = 'https://madoc.univ-nantes.fr';
    const currentUrl = window.location.toString();
    const indic = document.querySelector("#dropdownMenuLink");
    if (currentUrl.startsWith("https://madoc.univ-nantes.fr") && indic) {
        const dropdowns = document.querySelectorAll('.dropdown-item');
        dropdowns.forEach((dropdown) => {
            if (dropdown.innerText == "Avec un compte de Nantes Université") {
                window.location.replace(dropdown.href);
            }
        });
    } else if (currentUrl.startsWith(MADOC_URL + '/login/index.php')) {
        window.location.replace(document.querySelector('.btn.login-identityprovider-btn.btn-block').href);
    } 
    // else {
    //     try {
    //         const logoutBtn = document.querySelector('li#logout>a');
    //         logoutBtn.setAttribute('href', 'https://intraetu.univ-nantes.fr/identification/logout')
    //     } catch (error) {
    //         console.error('[BETTERUN][uncloud-autologin] Error while trying to replace the logout URL.\n' + error);
    //     }
    // }
})();