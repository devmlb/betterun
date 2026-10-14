(function() {
    UNCLOUD_URL = "https://uncloud.univ-nantes.fr";
    const currentUrl = window.location.toString();
    if (currentUrl === UNCLOUD_URL + "/index.php/login") {
        // Login page
        document.body.style.display = "none";
        window.location.replace(document.querySelector("#alternative-logins>a").href);
    } else if (currentUrl === UNCLOUD_URL + "/index.php/login?clear=1") {
        // Login page after logout
        // The user is disconnected from Nextcloud but not from the CAS, 
        // so we navigate to the CAS logout URL.
        window.location.replace("https://intraetu.univ-nantes.fr/identification/logout");
    }
})();