function getModById(modId, modsList) {
    for (const element of modsList) {
        if (Object.values(element).includes(modId)) {
            return element;
        }
    }
    return null;
}

async function getMods(modsFile = '/mods.json') {
    const modsFileContent = await fetch(chrome.runtime.getURL(modsFile));
    return modsFileContent.json();
}

async function getStructure(structureFile = '/structure.json') {
    const modsFileContent = await fetch(chrome.runtime.getURL(structureFile));
    return modsFileContent.json();
}

async function getExtensionStorage(key = null) {
    const storage = await chrome.storage.sync.get(key);
    return storage;
}

async function createModsPagesLinks(structure) {
    const modsPagesList = document.querySelector('#mods-list');
    structure.forEach(pageInfos => {
        let modPageLink = document.createElement('mdui-card');
        modPageLink.innerHTML = `
        <p>${pageInfos.name}</p>
        <i class="material-icons-round">arrow_right</i>
        `;
        modPageLink.setAttribute('clickable', '');
        modPageLink.setAttribute('variant', 'filled');
        modPageLink.id = pageInfos.id + '-btn';
        modPageLink.classList.add('mod-link');
        modsPagesList.appendChild(modPageLink);
        modPageLink.addEventListener('click', () => {
            document.getElementById(pageInfos.id).classList.add('swipe-left');
            document.querySelector('#home-page').classList.add('swipe-left');
        });
    });
}

async function createPages(structure) {
    structure.forEach(pageInfos => {
        let sections = '';
        Object.keys(pageInfos.sections).forEach(sectionId => {
            sections += '<section>';
            sections += `<h3>${pageInfos.sections[sectionId]}</h3>`;
            sections += `<mdui-card variant="filled" id="${pageInfos.id + '-' + sectionId}" class="mods-card"></mdui-card>
            </section>`;
        });
        let page = document.createElement('div');
        page.id = pageInfos.id;
        page.classList.add('page');
        page.innerHTML = `
        <header>
            <mdui-button-icon class="back-btn" icon="arrow_back--rounded"></mdui-button-icon>
            <h2>${pageInfos.name}</h2>
            <div class="growing-space"></div>
        </header>
        <div class="content">
        ${sections}
        </div>
        `;
        document.querySelector('body').appendChild(page);
    });
    document.querySelectorAll('.back-btn').forEach(backBtn => {
        backBtn.addEventListener('click', () => {
            backBtn.parentNode.parentNode.classList.remove('swipe-left');
            document.querySelector('#home-page').classList.remove('swipe-left');
        });
    });
}

async function enableDisableMod(modId, state) {
    let modSettings = await getExtensionStorage(modId);
    if (state) {
        modSettings[modId].enabled = true;
        console.info('Enabling mod with id ' + modId);
    } else {
        modSettings[modId].enabled = false;
        console.info('Disabling mod with id ' + modId);
    }
    chrome.storage.sync.set(modSettings);
}

async function createMods(modsList) {
    const localSettings = await getExtensionStorage();
    Object.keys(localSettings).forEach(key => {
        if (!key.startsWith('gbs-')) {
            let mod = getModById(key.replace('mod-', ''), modsList);
            if (!mod.hidden) {
                let modsCard = document.querySelector('section>#' + mod.pageId + '-' + mod.sectionId);
                let checkbox = document.createElement('mdui-checkbox');
                checkbox.setAttribute('id', 'mod-' + mod.id);
                checkbox.setAttribute('class', 'mod-checkbox');
                checkbox.innerHTML = `<div class="checkbox-div">
                    <p class="checkbox-title">${mod.title}<mdui-badge variant="large">${mod.version}</mdui-badge></p>
                    <p class="checkbox-desc">${mod.desc}</p>
                </div>`;
                if (localSettings[key].enabled) {
                    checkbox.setAttribute('checked', '');
                }
                if (!document.querySelector('#enable-switch mdui-switch').checked) {
                    checkbox.setAttribute('disabled', '');
                }
                modsCard.appendChild(checkbox);
                checkbox.addEventListener('change', () => {
                    enableDisableMod(checkbox.getAttribute('id'), checkbox.checked);
                });
            }
        }
    });
}

async function initUI() {
    const structure = await getStructure();
    const mods = await getMods();
    const localSettings = await getExtensionStorage();
    const enableSwitch = document.querySelector('#enable-switch mdui-switch');
    if (localSettings['gbs-enabled']) {
        enableSwitch.setAttribute('checked', '');
    }
    enableSwitch.addEventListener('change', () => {
        let modsCards = document.querySelectorAll('.mod-checkbox');
        let enableSwitchState = true;
        if (enableSwitch.checked) {
            modsCards.forEach((mod) => {
                mod.removeAttribute('disabled', '');
            });
            console.info('Enabling the extension');
        } else {
            enableSwitchState = false;
            modsCards.forEach((mod) => {
                mod.setAttribute('disabled', '');
            });
            console.info('Disabling the extension');
        }
        chrome.storage.sync.set({'gbs-enabled': enableSwitchState});
    });
    const enableSwitchCard = document.querySelector('#enable-switch');
    enableSwitchCard.addEventListener('click', () => {
        enableSwitch.click();
    });
    let settingsPage = document.querySelector('#settings-page');
    document.querySelector('#settings-btn').addEventListener('click', () => {
        settingsPage.classList.add('swipe-left');
        document.querySelector('#home-page').classList.add('swipe-left');
    });
    document.querySelector('#release-version').textContent = "v" + chrome.runtime.getManifest().version;
    createPages(structure);
    createModsPagesLinks(structure);
    createMods(mods);
}

document.addEventListener("DOMContentLoaded", function () {
    mdui.setColorScheme('#3452ff');
    initUI()
    setInterval(() => {
        document.querySelector('body').classList.add('ready');
    }, 160); // hiding the switch activation effect 
});