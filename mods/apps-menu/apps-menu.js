(function() {
    const appsMenu = document.querySelector('#outils_numeriques .toolbar__component__dropdown');
    const appsMenuUl = appsMenu.querySelector('ul');

    const newAppsShortcuts = [
        { name: 'Webmail', img: '/mods/apps-menu/icons/mail.png', url: 'https://intraetu.univ-nantes.fr/vos-webservices/webmail', alt: 'Webmail' },
        { name: 'Madoc', img: '/mods/apps-menu/icons/school.png', url: 'https://intraetu.univ-nantes.fr/vos-webservices/madoc', alt: 'Madoc' },
        { name: 'UNcloud', img: '/mods/apps-menu/icons/cloud.png', url: 'https://intraetu.univ-nantes.fr/vos-webservices/uncloud', alt: 'UNcloud' },
        { name: 'Emploi du temps', img: '/mods/apps-menu/icons/calendar.png', url: 'https://edt.univ-nantes.fr/edt', alt: 'Emploi du temps' },
        { name: 'Gestion des absences', img: '/mods/apps-menu/icons/contract.png', url: 'https://abs-sciences.univ-nantes.fr/', alt: 'Gestion des absences' }
    ];
    
    appsMenuUl.innerHTML = '';
    newAppsShortcuts.forEach(shortcut => {
        let shortcutLi = document.createElement('li');
        shortcutLi.classList = 'outils_numeriques__item';
        let shortcutBtn = document.createElement('a');
        shortcutBtn.setAttribute('href', shortcut.url);
        shortcutBtn.setAttribute('target', '_blank');
        let shortcutImg = document.createElement('img');
        shortcutImg.setAttribute('src', chrome.runtime.getURL(shortcut.img));
        shortcutImg.setAttribute('alt', shortcut.alt);
        let shortcutName = document.createTextNode(shortcut.name);
        shortcutBtn.appendChild(shortcutImg);
        shortcutBtn.appendChild(shortcutName);
        shortcutLi.appendChild(shortcutBtn);
        appsMenuUl.appendChild(shortcutLi)
    });

    const allAppsSpan = document.createElement('span');
    const allAppsBtn = document.createElement('a');
    allAppsBtn.textContent = 'Tous vos webservices';
    allAppsBtn.setAttribute('href', 'https://intraetu.univ-nantes.fr/vos-webservices-1');
    allAppsSpan.appendChild(allAppsBtn);
    appsMenu.appendChild(allAppsSpan);
})();