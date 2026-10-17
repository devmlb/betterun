(function () {
    const UNCLOUD_URL = "https://uncloud.univ-nantes.fr";
    const currentUrl = window.location.toString();

    if (currentUrl === UNCLOUD_URL + "/index.php/login?clear=1") {
        // Login page after logout
        // The user is disconnected from Nextcloud but not from the CAS,
        // so we navigate to the CAS logout URL.
        window.location.replace(
            "https://intraetu.univ-nantes.fr/identification/logout",
        );
    } else if (currentUrl.startsWith(UNCLOUD_URL + "/index.php/login")) {
        // Login page
        // https://uncloud.univ-nantes.fr/index.php/login
        // https://uncloud.univ-nantes.fr/index.php/login?redirect_url=/index.php/apps/files/

        const redirectUrl = document.querySelector<HTMLAnchorElement>(
            "#alternative-logins>a",
        )?.href;

        if (!redirectUrl) return;

        const redirectText = document.createElement("h2");
        redirectText.className = "login-form__headline";
        redirectText.textContent =
            "Redirection vers l'authentification centralisée...";

        const form = document.querySelector(".guest-box.login-box");
        if (!form) return;

        form.childNodes.forEach((n) => form.removeChild(n));
        form.appendChild(redirectText);

        window.location.replace(redirectUrl);
    }
})();
