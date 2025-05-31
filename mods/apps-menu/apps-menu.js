(function () {
    const appsMenu = document.querySelector('#outils_numeriques .toolbar__component__dropdown');
    const appsMenuUl = appsMenu.querySelector('ul');

    const newAppsShortcuts = [
        { name: 'Webmail', img: 'mail', url: 'https://intraetu.univ-nantes.fr/vos-webservices/webmail', alt: 'Webmail' },
        { name: 'Madoc', img: 'school', url: 'https://intraetu.univ-nantes.fr/vos-webservices/madoc', alt: 'Madoc' },
        { name: 'UNcloud', img: 'cloud', url: 'https://intraetu.univ-nantes.fr/vos-webservices/uncloud', alt: 'UNcloud' },
        { name: 'Emploi du temps', img: 'calendar_today', url: 'https://edt.univ-nantes.fr/edt', alt: 'Emploi du temps' },
        { name: 'Gestion des absences', img: 'contract_edit', url: 'https://abs-sciences.univ-nantes.fr/', alt: 'Gestion des absences' }
    ];

    // appsMenuUl.innerHTML = '';
    // newAppsShortcuts.forEach(shortcut => {
    //     let shortcutLi = document.createElement('li');
    //     shortcutLi.classList = 'toolbar-grid-menu__element';
    //     let shortcutBtn = document.createElement('a');
    //     shortcutBtn.setAttribute('href', shortcut.url);
    //     shortcutBtn.setAttribute('target', '_blank');
    //     let shortcutImg = document.createElement('img');
    //     shortcutImg.setAttribute('src', chrome.runtime.getURL(shortcut.img));
    //     shortcutImg.setAttribute('alt', shortcut.alt);
    //     let shortcutName = document.createTextNode(shortcut.name);
    //     shortcutBtn.appendChild(shortcutImg);
    //     shortcutBtn.appendChild(shortcutName);
    //     shortcutLi.appendChild(shortcutBtn);
    //     appsMenuUl.appendChild(shortcutLi)
    // });

    // const allAppsSpan = document.createElement('span');
    // const allAppsBtn = document.createElement('a');
    // allAppsBtn.textContent = 'Tous vos webservices';
    // allAppsBtn.setAttribute('href', 'https://intraetu.univ-nantes.fr/vos-webservices-1');
    // allAppsSpan.appendChild(allAppsBtn);
    // appsMenu.appendChild(allAppsSpan);

    let appsMenuHTML = `
    <div class="toolbar__component__dropdown" data-toggle-target="">
        <ul>
    `;
    newAppsShortcuts.forEach(shortcut => {
        appsMenuHTML += `
        <li class="toolbar-grid-menu__element"><a href="${shortcut.url}" target="_blank"><i class="material-icons-round">${shortcut.img}</i>${shortcut.name}</a></li>
        `
    });
    appsMenuHTML += `
        </ul>
        <a href="https://intraetu.univ-nantes.fr/vos-webservices-1">Tous les webservices</a>
    </div>
    `
    let connexionMenuHTML = `
    <div class="toolbar__component__dropdown" data-toggle-target="">
        <div id="account-menu-header">
            <svg width="128" height="160" viewBox="0 0 128 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M96.1698 95.6868V90.6194H128V95.6868C128 131.598 99.9785 159.755 63.9322 159.755C28.0211 159.755 0 131.598 0 95.6868V90.6194L31.8298 90.6151V95.6868C31.8298 115.274 45.4322 129.422 63.9322 129.422C82.5674 129.422 96.1698 115.274 96.1698 95.6868Z" fill="white"/>
                <path d="M128 65.0189V-2.28882e-05H98.0742V44.2085L75.8362 -2.28882e-05H42.5757L76.1882 65.0189H128Z" fill="white"/>
                <path d="M31.1499 65.0189H0V-2.28882e-05H31.1499V65.0189Z" fill="white"/>
            </svg>
            <div>
                <h3>${document.querySelector('.bandeau_acces_direct__component>a').textContent}</h3>
                <span>${document.querySelector('#personne_dsi').textContent}</span>
            </div>
        </div>
        <a href="${document.querySelector('#se_deconnecter_desktop').href}">Se déconnecter</a>
    </div>
    `;

    const header = document.querySelector('.header__inner.encadrement');
    const toolbar = document.createElement('div');
    toolbar.classList = 'header__toolbar toolbar toolbar-new';
    toolbar.innerHTML = `
    <a href="https://intraetu.univ-nantes.fr/" class="header__logo__lien" title="Retour à la page d'accueil">
        <img src="/uas/intraetu/LOGO_STICKY/NantesUniversite.png" alt="logo-Retour à la page d'accueil">
    </a>
    <div class="toolbar__component">
        <button class="button button-link" onclick="window.location.replace('https://intraetu.univ-nantes.fr/')">
            <span class="button-label">Accueil</span>
            <i class="material-icons-round">home</i>
        </button>
    </div>
    <div id="digital-tools-new" class="toolbar__component">
        <button type="button" class="button button-link" aria-expanded="false" data-toggle="#digital-tools-new .toolbar__component__dropdown" data-toggle-group="toolbar">
            <span class="button-label">Outils numériques</span>
            <i class="material-icons-round">apps</i>
        </button>
        ${appsMenuHTML}
    </div>
    <div id="recherche-simple" class="toolbar__component">
        <button type="button" class="button button-link" aria-expanded="false" data-toggle="body" data-toggle-class="recherche-simple" data-toggle-event="toggle-search">
            <span class="button-label">Rechercher</span>
            <i class="material-icons-round">search</i>
        </button>
        <div class="toolbar__component__dropdown" tabindex="0">
            <button type="button" class="toolbar__component__close button button-link" data-toggle="body.recherche-simple" data-toggle-class="recherche-simple">×</button>
            <form class="search_query_input_overlay" action="https://intraetu.univ-nantes.fr/search" method="get" novalidate="novalidate">
                <input type="hidden" name="l" value="0">
                <input type="hidden" name="RH" value="INTRAETU">
                <input type="hidden" name="beanKey" value="150bfcee-1f87-11e7-a0e0-b753bedcad22">
                <input type="hidden" name="site" value="INTRAETU">
                <input name="q" autocomplete="off" role="search" type="search" id="MOTS_CLEFS" data-beankey="150bfcee-1f87-11e7-a0e0-b753bedcad22" placeholder="Rechercher" title="Recherche par mots-clés">
                <button type="submit" class="button button-link">
                    <span class="button-label sr-only">Rechercher</span>
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 52.966 52.966" fill="#FFFFFF" width="24">
                        <path d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21  c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279  C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19  S32.459,40,21.983,40z"></path>
                    </svg>
                </button>
            </form>
        </div>
    </div>
    <div id="connexion-new" class="toolbar__component">
        <button type="button" class="button button-link" aria-expanded="false" data-toggle="#connexion-new .toolbar__component__dropdown" data-toggle-group="toolbar">
            <span class="button-label">Compte</span>
            <i class="material-icons-round">account_circle</i>
        </button>
        ${connexionMenuHTML}
    </div>
    `;
    header.appendChild(toolbar);
    document.querySelector('.header__toolbar.toolbar').remove();
    // document.querySelector('.bandeau_acces_direct').remove();
    // <button type="button" class="button button-link" aria-expanded="false" data-toggle="#connexion .toolbar__component__dropdown" data-toggle-group="toolbar">
    //             </button>
})();