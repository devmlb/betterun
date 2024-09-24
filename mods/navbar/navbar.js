(function() {
    const iconsBarUl = document.querySelector(".l-personal-menu-items.h-hlist");
    try {
        const workspacesLi = document.querySelector('.l-tab-menu-text.l-menu-course.js-menuitem--dropdown').cloneNode(true);
        workspacesLi.setAttribute("class", "l-personal-badge-menu-item h-position-r");
        workspacesLi.removeChild(workspacesLi.querySelector("li>div"));
        workspacesLi.removeChild(workspacesLi.querySelector("li>script"));

        const workspacesIcon = workspacesLi.querySelector("li>button>img");
        workspacesIcon.src = chrome.runtime.getURL("mods/material-icons-round-svg/school_black_24dp.svg");
        workspacesIcon.setAttribute("class", "h-va-middle l-personal-menu-icon-notifications l-menu-icons");
        workspacesIcon.setAttribute("style", "height:24px;width:24px;");

        const workspacesBtn = workspacesLi.querySelector('li>button');
        workspacesBtn.setAttribute("class", "h-position-r h-pdl5 h-pdr5 l-personal-menu-items-link");
        workspacesBtn.setAttribute("id", "Workspaces");
        workspacesBtn.removeAttribute("data-action")

        const workspacesMenu = document.querySelector('[data-dropdown="courses"]');
        workspacesBtn.addEventListener("click", function() {
            console.log(workspacesMenu.style.display);
            if (workspacesMenu.style.display == 'none') {
                document.querySelector('.l-menu-course>button').click();
            } else {
                document.querySelector('.l-menu-course>button').click();
            }
        });

        iconsBarUl.prepend(workspacesLi);

        let worspacesMenuObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutationRecord) {
                if (workspacesMenu.style.display == 'block') {
                    workspacesBtn.classList.add("navbar-menu-opened");
                    workspacesIcon.classList.add("navbar-menu-opened");
                } else {
                    workspacesBtn.classList.remove("navbar-menu-opened");
                    workspacesIcon.classList.remove("navbar-menu-opened");
                }
            });
        });
        worspacesMenuObserver.observe(workspacesMenu, {
            attributes: true,
            attributeFilter: ['style']
        });
    } catch (e) {
        console.log("Error when applying style to the navbar workspaces button: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    try {
        const communitiesLi = document.querySelector('.l-tab-menu-text.l-menu-project.js-menuitem--dropdown').cloneNode(true);
        communitiesLi.setAttribute("class", "l-personal-badge-menu-item h-position-r");
        communitiesLi.removeChild(communitiesLi.querySelector("li>div"));

        const communitiesIcon = communitiesLi.querySelector("li>button>img");
        communitiesIcon.src = chrome.runtime.getURL("mods/material-icons-round-svg/domain_black_24dp.svg");
        communitiesIcon.setAttribute("class", "h-va-middle l-personal-menu-icon-notifications l-menu-icons");
        communitiesIcon.setAttribute("style", "height:24px;width:24px;");

        const communitiesBtn = communitiesLi.querySelector('li>button');
        communitiesBtn.setAttribute("class", "h-position-r h-pdl5 h-pdr5 l-personal-menu-items-link");
        communitiesBtn.setAttribute("id", "Communities");
        communitiesBtn.removeAttribute("data-action")

        const communitiesMenu = document.querySelector('[data-dropdown="data-projects-dropdown"]');
        communitiesBtn.addEventListener("click", function() {
            console.log(communitiesMenu.style.display);
            if (communitiesMenu.style.display == 'none') {
                document.querySelector('.l-menu-project>button').click();
            } else {
                document.querySelector('.l-menu-project>button').click();
            }
        });

        iconsBarUl.prepend(communitiesLi);

        let communitiesMenuObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutationRecord) {
                if (communitiesMenu.style.display == 'block') {
                    communitiesBtn.classList.add("navbar-menu-opened");
                    communitiesIcon.classList.add("navbar-menu-opened");
                } else {
                    communitiesBtn.classList.remove("navbar-menu-opened");
                    communitiesIcon.classList.remove("navbar-menu-opened");
                }
            });
        });
        communitiesMenuObserver.observe(communitiesMenu, {
            attributes: true,
            attributeFilter: ['style']
        });
    } catch (e) {
        console.log("Error when applying style to the navbar communities button: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    try {
        const notifsBtn = document.querySelector('#Notification');
        const notifsMenu = document.querySelector('#notifications-overlay-wrapper');
        const notifsIcon = notifsBtn.querySelector('button>img');
        let notifsMenuObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutationRecord) {
                if (notifsMenu.style.display == 'block') {
                    notifsBtn.classList.add("navbar-menu-opened");
                    notifsIcon.classList.add("navbar-menu-opened");
                } else {
                    notifsBtn.classList.remove("navbar-menu-opened");
                    notifsIcon.classList.remove("navbar-menu-opened");
                }
            });
        });
        notifsMenuObserver.observe(notifsMenu, {
            attributes: true,
            attributeFilter: ['style']
        });
    } catch (e) {
        console.log("Error when applying style to the navbar notifications button: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    try {
        const persoMenuImg = document.querySelectorAll('#personal-menu-link img')[0];
        const persoMenu = document.querySelectorAll('#personal-menu-dd')[0];
        let persoMenuObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutationRecord) {
                if (persoMenu.style.display == 'block') {
                    persoMenuImg.classList.add("navbar-perso-menu-opened");
                } else {
                    persoMenuImg.classList.remove("navbar-perso-menu-opened");
                }
            });
        });
        persoMenuObserver.observe(persoMenu, {
            attributes: true,
            attributeFilter: ['style']
        });
    } catch (e) {
        console.log("Error when applying style to the navbar personal menu icon: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    try {
        let logo = document.querySelectorAll("li.l-tab-menu-text.l-menu-home.l-menu-itslearning>a>img")[0];
        let navbar = document.querySelectorAll(".l-main-menu-items.h-is-not-mobile")[0];
        let logoLi = document.createElement("li");
        logoLi.setAttribute("style", "height: 64px; display: flex; align-items: center; padding: 0px 10px 0px 20px;");
        logo.setAttribute("style", "height: 30px; width: 30px;");
        navbar.prepend(logoLi);
        logoLi.prepend(logo);
    } catch (e) {
        console.log("Error when applying style to the navbar logo: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    let navLinks = document.querySelectorAll('[target="_blank"].l-main-menu-lnk');
    for (const link of navLinks) {
        let linksIcon = document.createElement("i");
        linksIcon.setAttribute('class', 'material-icons-round');
        linksIcon.setAttribute("style", "margin-left: 5px; font-size: 20px;")
        linksIcon.textContent = "open_in_new";
        link.appendChild(linksIcon)
    }

    try {
        let displayedName = document.querySelectorAll('.l-personal-menu-name>span.h-va-middle')[0];
        displayedName.remove();
    } catch (e) {
        console.log("Error when applying style to the personal menu name: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }

    try {
        const moreBtn = document.querySelectorAll('li.l-more-menu-btn.l-tab-menu-text:not(:has(> #main-content-nav-more)) button.l-main-menu-lnk')[0];
        let moreIcon = document.createElement("i");
        moreIcon.setAttribute('class', 'material-icons-round');
        moreIcon.setAttribute("style", "margin-left: 5px; font-size: 24px;")
        moreIcon.textContent = "arrow_drop_down";
        moreBtn.appendChild(moreIcon)
    } catch (e) {
        console.log("Error when applying style to the navbar personal menu icon: "+e+" You can ignore this error as long as it does not affect your use of Itslearning.");
    }
})();