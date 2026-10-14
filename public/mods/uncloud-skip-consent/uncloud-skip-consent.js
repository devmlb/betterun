(function() {
    const currentUrl = window.location.toString();
    if (currentUrl.includes("oidc/oidcAuthorize") && currentUrl.includes("uncloud")) {
        document.body.style.display = "none";
        window.location.replace(document.querySelector("#allow").href);
    }
})();