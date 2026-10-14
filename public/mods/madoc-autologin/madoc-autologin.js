(function () {
    const MADOC_BASE_URL = "https://madoc.univ-nantes.fr";

    const currentUrl = window.location.toString();
    const loginDropdown = document.querySelector("#dropdownMenuLink");

    console.log(currentUrl)

    if ((currentUrl === MADOC_BASE_URL || currentUrl === MADOC_BASE_URL + "/") && loginDropdown) {
        // If there is a dropdown we are on the home page with login options
        const dropdownCASItem = loginDropdown.parentElement.querySelectorAll(".dropdown-item").values().find((d) => 
            d.innerText.includes("de Nantes Université"));
        if (!dropdownCASItem) return;

        const redirectUrl = dropdownCASItem.href;

        // Adding redirection indicator to inform the user
        const jumbotron = document.querySelector(".jumbotron");
        const redirectDisplay = document.createElement("div");
        redirectDisplay.className = "row align-items-center";
        const redirectTextWrapper = document.createElement("div");
        redirectDisplay.appendChild(redirectTextWrapper);
        redirectTextWrapper.className = "mx-auto";
        const redirectText = document.createElement("h4");
        redirectText.innerText = "Redirection vers l'authentification centralisée...";
        redirectTextWrapper.appendChild(redirectText);
        document.querySelectorAll(".jumbotron > .row").forEach(c => jumbotron.removeChild(c));
        jumbotron.appendChild(redirectDisplay);
        
        window.location.replace(redirectUrl);
    } else if (currentUrl === MADOC_BASE_URL + "/login/index.php") {
        // Alternative login page
        const redirectUrl = document.querySelector(".btn.login-identityprovider-btn.btn-block").href;

        // Adding redirection indicator to inform the user
        const loginForm = document.querySelector(".loginform");
        const redirectText = document.createElement("h2");
        redirectText.className = "login-heading";
        redirectText.innerText = "Redirection vers l'authentification centralisée...";
        const divider = document.createElement("div");
        divider.className = "login-divider";
        document.querySelectorAll(".loginform > *").forEach(c => {
            if (c.id !== "loginlogo") loginForm.removeChild(c);
        });
        loginForm.appendChild(divider);
        loginForm.appendChild(redirectText);

        window.location.replace(redirectUrl);
    } 
})();