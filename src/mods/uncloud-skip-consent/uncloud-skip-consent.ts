(function () {
    const currentUrl = window.location.toString();
    if (
        currentUrl.includes("oidc/oidcAuthorize") &&
        currentUrl.includes("uncloud")
    ) {
        document.body.style.display = "none";
        const allowLink = document.querySelector<HTMLAnchorElement>("#allow");
        if (allowLink?.href) {
            window.location.replace(allowLink.href);
        }
    }
})();
