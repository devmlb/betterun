function getModById(modId, modsList) {
    for (const element of modsList) {
        if (Object.values(element).includes(modId)) {
            return element;
        }
    }
    return null;
}

function checkUpdates() {
    // fetch('https://devmlb.github.io/bun/release.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         const latestVersion = data['latest-version'];
    //         const currentManifestVersion = chrome.runtime.getManifest().version
    //         if (latestVersion != currentManifestVersion) {
    //             const updateCard = document.getElementById('update-card');
    //             updateCard.style.display = "flex"
    //             updateCard.addEventListener("click", function () {
    //                 window.open('https://github.com/devmlb/bun/releases/latest', '_blank').focus();
    //             });
    //             console.log('Update available! (v' + currentManifestVersion + " > v" + latestVersion + ")");
    //             chrome.action.setBadgeText({ text: "!" });
    //             chrome.action.setBadgeTextColor({ color: [255, 255, 255, 255] });
    //             chrome.action.setBadgeBackgroundColor({ color: [186, 26, 26, 255] });
    //         }
    //     });
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

async function createPagesLinks(structure) {
    const modsList = document.querySelector('#mods-list');
    structure.forEach(pageInfos => {
        let pageLink = document.createElement('div');
        pageLink.innerHTML = `
        <mdui-card variant="filled" clickable id="${pageInfos.id}-btn" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <p>${pageInfos.name}</p>
            <i class="material-icons-round" style="margin-left: 20px;">arrow_right</i>
        </mdui-card>
        `
        modsList.appendChild(pageLink)
        document.getElementById(pageInfos.id + '-btn').addEventListener("click", () => {
            document.getElementById(pageInfos.id).classList.add('swipe-left');
            document.getElementById('home-page').classList.add('swipe-left');
        });
    });
}

async function createPages(structure) {
    const body = document.querySelector('body');
    const homePage = document.querySelector('#home-page');
    structure.forEach(pageInfos => {
        let sections = '';
        Object.keys(pageInfos.sections).forEach(sectionId => {
            if (sectionId != 'main') {
                sections += `<section>
                <h3>${pageInfos.sections[sectionId]}</h3>
                <mdui-card variant="filled" id="${pageInfos.id + '-' + sectionId}" class="mods-card"></mdui-card>
                </section>`;
            } else {
                sections += `<section>
                <mdui-card variant="filled" id="${pageInfos.id + '-' + sectionId}" class="mods-card"></mdui-card>
                </section>`;
            }
        });
        let page = document.createElement('div');
        page.id = pageInfos.id;
        page.classList = 'page';
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
        body.appendChild(page)
        page.querySelector('.back-btn').addEventListener("click", () => {
            page.classList.remove('swipe-left');
            homePage.classList.remove('swipe-left');
        });
    });
    let settingsPage = document.querySelector('#settings-page');
    document.querySelector('#settings-btn').addEventListener("click", () => {
        settingsPage.classList.add('swipe-left');
        homePage.classList.add('swipe-left');
    });
    settingsPage.querySelector('.back-btn').addEventListener("click", () => {
        settingsPage.classList.remove('swipe-left');
        homePage.classList.remove('swipe-left');
    });
}

async function enableDisableMod(modId, state) {
    let modSettings = await getExtensionStorage(modId);
    console.log(state)
    if (state) {
        modSettings[modId].enabled = true;
    } else {
        modSettings[modId].enabled = false;
    }
    console.info("Updating setting with id '" + modId + "' to " + modSettings)
    chrome.storage.sync.set(modSettings);
}

async function createMods(modsList) {
    const activeSwitch = document.querySelector("#enable-switch mdui-switch");
    chrome.storage.sync.get(null, function (localSettings) {
        if (localSettings["gbs-enabled"]) {
            activeSwitch.setAttribute('checked', '');
        }
        activeSwitch.addEventListener('change', () => {
            let activeSwitchState = {};
            let modsCards = document.querySelectorAll('.mod-checkbox');
            if (activeSwitch.checked) {
                activeSwitchState["gbs-enabled"] = true
                modsCards.forEach((mod) => {
                    mod.removeAttribute('disabled', '');
                });
            } else {
                activeSwitchState["gbs-enabled"] = false
                modsCards.forEach((mod) => {
                    mod.setAttribute('disabled', '');
                });
            }
            console.info("Updating setting with id 'gbs-enabled' to " + activeSwitchState['gbs-enabled'])
            chrome.storage.sync.set(activeSwitchState);
        });
        const currentVersion = chrome.runtime.getManifest().version;
        document.getElementById("release-version").textContent = "v" + currentVersion;
        for (const key in localSettings) {
            if (!key.startsWith('gbs-')) {
                let tempMod = getModById(key.replace('mod-', ''), modsList);
                if (!tempMod.hidden) {
                    let settingsCard = document.querySelector('section>#' + tempMod.pageId + '-' + tempMod.sectionId);
                    let checkbox = document.createElement("mdui-checkbox");
                    checkbox.innerHTML = `
                    <div class="checkbox-div">
                        <p class="checkbox-title">${tempMod.title}<mdui-badge variant="large">${tempMod.version}</mdui-badge></p>
                        <p class="checkbox-desc">${tempMod.desc}</p>
                    </div>
                    `
                    checkbox.setAttribute('id', 'mod-' + tempMod.id);
                    checkbox.setAttribute('class', 'mod-checkbox');
                    if (localSettings[key].enabled) {
                        checkbox.setAttribute('checked', '');
                    }
                    if (!activeSwitch.checked) {
                        checkbox.setAttribute('disabled', '');
                    }
                    settingsCard.appendChild(checkbox);
                    checkbox.addEventListener('change', () => {
                        let checkboxId = checkbox.getAttribute("id");
                        enableDisableMod(checkboxId, checkbox.checked);
                    });
                }
            }
        }
    });
}

async function initUI() {
    const structure = await getStructure();
    const mods = await getMods();
    createPages(structure);
    createPagesLinks(structure);
    console.log(mods)
    createMods(mods);
}

document.addEventListener("DOMContentLoaded", function () {
    mdui.setColorScheme('#3452ff');

    initUI()

    setInterval(() => {
        document.querySelector('body').classList.add('ready');
    }, 160); // hiding the switch activation effect 
    

    // const settingsCard = document.getElementById("settings");
    const activeSwitch = document.querySelector("#enable-switch mdui-switch");
    // const activeSwitchHoverEffect = document.querySelector("#active-switch").shadowRoot.querySelector("label > div > div > mdui-ripple").shadowRoot.querySelector("div")
    const divActiveSwitch = document.querySelector("#enable-switch");
    // // const checkUpdatesBtn = document.getElementById("check-updates-btn");
    // divActiveSwitch.addEventListener("click", function () {
    //     activeSwitch.click()
    // });
    // checkUpdatesBtn.addEventListener("click", function() {
    //     checkUpdates();
    //     window.scrollTo({top: 0, behavior: 'smooth'});
    // });
    // divActiveSwitch.addEventListener("mouseover", function () {
    //     activeSwitch.setAttribute('hover', '');
    //     activeSwitchHoverEffect.classList.add("hover");
    // });
    // divActiveSwitch.addEventListener("mouseout", function () {
    //     activeSwitch.removeAttribute('hover', '');
    //     activeSwitchHoverEffect.classList.remove("hover");
    // });
    divActiveSwitch.addEventListener('click', () => {
        activeSwitch.click();
    });
});