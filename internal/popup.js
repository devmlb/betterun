function getModById(modId, modsList) {
    for (const element of modsList) {
        if (Object.values(element).includes(modId)) {
            return element;
        }
    }
    return null;
}

function checkUpdates() {
    fetch('https://devmlb.github.io/itsbetter/release.json')
        .then(response => response.json())
        .then(data => {
            const latestVersion = data['latest-version'];
            const currentManifestVersion = chrome.runtime.getManifest().version
            if (latestVersion != currentManifestVersion) {
                const updateCard = document.getElementById('update-card');
                updateCard.style.display = "flex"
                updateCard.addEventListener("click", function() {
                    window.open('https://github.com/devmlb/itsbetter/releases/latest', '_blank').focus();
                });
                console.log('Update available! (v'+currentManifestVersion+" > v"+latestVersion+")");
                chrome.action.setBadgeText({ text: "!" });
                chrome.action.setBadgeTextColor({ color: [255, 255, 255, 255] });
                chrome.action.setBadgeBackgroundColor({ color: [186, 26, 26, 255] });
            }
        });
}

document.addEventListener("DOMContentLoaded", function () {
    mdui.setColorScheme('#f47920');
    const settingsCard = document.getElementById("settings");
    const activeSwitch = document.getElementById("active-switch");
    const activeSwitchHoverEffect = document.querySelector("#active-switch").shadowRoot.querySelector("label > div > div > mdui-ripple").shadowRoot.querySelector("div")
    const divActiveSwitch = document.getElementById("div-active-switch");
    const checkUpdatesBtn = document.getElementById("check-updates-btn");
    divActiveSwitch.addEventListener("click", function() {
        activeSwitch.click()
    });
    checkUpdatesBtn.addEventListener("click", function() {
        checkUpdates();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
    divActiveSwitch.addEventListener("mouseover", function() {
        activeSwitch.setAttribute('hover', '');
        activeSwitchHoverEffect.classList.add("hover");
    });
    divActiveSwitch.addEventListener("mouseout", function() {
        activeSwitch.removeAttribute('hover', '');
        activeSwitchHoverEffect.classList.remove("hover");
    });
    checkUpdates();
    fetch(chrome.runtime.getURL("/available-mods.json")).then(function (response) {
        return response.json();
    }).then(function (modsList) {
        chrome.storage.sync.get(null, function (localSettings) {
            if (localSettings["active-extension"]) {
                activeSwitch.setAttribute('checked', '');
            }
            activeSwitch.addEventListener('change', () => {
                let activeSwitchState = {}
                let checkboxes = settingsCard.childNodes
                if (activeSwitch.checked) {
                    activeSwitchState["active-extension"] = true
                    checkboxes.forEach(function(item) {
                        item.removeAttribute('disabled', '');
                    });
                } else {
                    activeSwitchState["active-extension"] = false
                    checkboxes.forEach(function(item) {
                        item.setAttribute('disabled', '');
                    });
                }
                console.info("Updating setting with id 'active-extension' to "+activeSwitchState['active-extension'])
                chrome.storage.sync.set(activeSwitchState);
            });
            const currentVersion = chrome.runtime.getManifest().version;
            document.getElementById("about").textContent = "À propos (v"+currentVersion+")"
            for (const key in localSettings) {
                if (key !== "active-extension" && key !== "updated") {
                    let tempMod = getModById(key, modsList)
                    if (!tempMod.hidden) {
                        let checkbox = document.createElement("mdui-checkbox");
                        let checkboxDivContent = document.createElement("div");
                        let checkboxTitle = document.createElement("p");
                        let checkboxDesc = document.createElement("p");
                        let checkboxBadge = document.createElement("mdui-badge");
                        checkboxBadge.setAttribute('variant', "large");
                        checkboxBadge.textContent = tempMod.version
                        checkboxDesc.setAttribute('class', "checkbox-desc");
                        checkboxTitle.textContent = tempMod.title
                        checkboxTitle.setAttribute('class', "checkbox-title");
                        checkboxTitle.appendChild(checkboxBadge)
                        checkboxDesc.textContent = tempMod.desc
                        checkboxDivContent.appendChild(checkboxTitle);
                        checkboxDivContent.appendChild(checkboxDesc);
                        checkboxDivContent.setAttribute('class', "checkbox-div");
                        checkbox.appendChild(checkboxDivContent);
                        checkbox.setAttribute('id', tempMod.id);
                        if (localSettings[key]) {
                            checkbox.setAttribute('checked', '');
                        }
                        if (!activeSwitch.checked) {
                            checkbox.setAttribute('disabled', '');
                        }
                        settingsCard.appendChild(checkbox);
                        checkbox.addEventListener('change', () => {
                            let checkboxId = checkbox.getAttribute("id")
                            let checkboxState = {}
                            if (checkbox.checked) {
                                checkboxState[checkboxId] = true
                            } else {
                                checkboxState[checkboxId] = false
                            }
                            console.info("Updating setting with id '"+checkboxId+"' to "+checkboxState[checkboxId])
                            chrome.storage.sync.set(checkboxState);
                        });
                    }
                }
            }
        });
    });
});