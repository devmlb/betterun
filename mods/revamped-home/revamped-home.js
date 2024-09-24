(async function() {
    const itsbetterAPI = new ItsbetterAPI();

    if (window.location.host !== "elyco.itslearning.com") return
    if (window.location.pathname !== "/DashboardMenu.aspx") return
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("LocationType") === "Hierarchy" && urlParams.has("LocationId")) {
        window.location.href = "https://elyco.itslearning.com/DashboardMenu.aspx?LocationType=Personal&DashboardType=MyPage"
        return
    } else if (urlParams.get("LocationType") === "Personal" && urlParams.get("DashboardType") === "MyPage") {
        const mainElement = document.querySelector("main")

        const iframeDashboard = document.createElement("iframe")

        const hierarchy = await itsbetterAPI.apiCall("personal/hierarchies/default/v1")
        iframeDashboard.src = `/Dashboard/Dashboard.aspx?LocationID=${hierarchy.HierarchyId}&LocationType=Hierarchy`
        iframeDashboard.style.display = "none"
        mainElement.insertBefore(iframeDashboard, mainElement.querySelector("*"))
        
        const iframePersonal = document.querySelector("#ctl00_ContentAreaIframe")
        iframePersonal.style.display = "none"

        const loadedComponents = []

        iframeDashboard.addEventListener("load", () => composePage(iframeDashboard))
        iframePersonal.addEventListener("load", () => composePage(iframePersonal))

        function composePage(element) {
            loadedComponents.push(element)
            if (loadedComponents.length !== 2) return

            const content = mainElement.appendChild(document.createElement("div"))
            content.classList.add("rh--content")
            content.innerHTML = `
                <nav class="rh--navbar">
                    <div class="rh--navbar--part" id="rh--nav--tabs"></div>
                    <div class="rh--navbar--part" id="rh--nav--external"></div>
                </nav>
            `

            const tabsDiv = content.querySelector("#rh--nav--tabs")
            const externalDiv = content.querySelector("#rh--nav--external")

            const associations = [
                { name: "Pronote", regex: /^(http(s|):\/\/|)[0-9]{7}[a-z]\.index-education\.net\/pronote.*$/, icon: chrome.runtime.getURL("/mods/revamped-home/icons/pronote.webp") },
                { name: "Esidoc", regex: /^(http(s|):\/\/|)[0-9]{7}[a-z]\.esidoc\.fr.*$/, icon: chrome.runtime.getURL("/mods/revamped-home/icons/esidoc.png") },
            ]

            const disabledLinks = [
                /^(http(s|):\/\/|)webmel\.ac-nantes\.fr.*/,
                /^(http(s|):\/\/|)glpi-lycees\.ac-nantes\.fr.*/,
            ]

            const links = []
            for (const link of iframeDashboard.contentDocument.querySelector("#ctl00_ContentPlaceHolder_DashboardLayout_ctl04_ctl03_CT").querySelectorAll("a")) {
                if (disabledLinks.some(disabledLink => disabledLink.test(link.href))) continue
                const association = associations.find(association => association.regex.test(link.href))
                const linkElement = document.createElement("a")
                linkElement.href = link.href
                const hostname = new URL(link.href).hostname
                linkElement.target = "_blank"
                linkElement.classList.add("rh--navbar--tab")
                linkElement.innerHTML = association ? `
                    <img class="rh--navbar--tab--icon" src="${association.icon}" alt="" />${association.name}` : `
                    <span class="rh--navbar--tab--icon material-icons-round icon__undefined">link</span>${hostname}`
                links.push({ html: linkElement, association })
            }
            for (const link of links.sort((a) => a.association ? -1 : 1))
                externalDiv.appendChild(link.html)

            const tabs = [
                { id: "tasks", name: "Tâches", icon: "task", element: iframePersonal.contentDocument.querySelector(".itsl-cb-tasks") },
                { id: "news", name: "Actualités", icon: "newspaper", element: iframePersonal.contentDocument.querySelector(".itsl-cb-stream") },
                { id: "calendar", name: "Calendrier", icon: "event", element: iframePersonal.contentDocument.querySelector(".itsl-cb-activities")}
            ]

            for (const tab of tabs) {
                const tabElement = document.createElement("span")
                tabElement.classList.add("rh--navbar--tab")
                tabElement.setAttribute("tabindex", 0)
                tabElement.innerHTML = `<span class="rh--navbar--tab--icon material-icons-round">${tab.icon}</span> ${tab.name}`
                tabElement.addEventListener("click", () => changeTab(tab))
                tabsDiv.appendChild(tabElement)
                tab.navbarElement = tabElement
            }
            
            for (const liElement of tabs[1].element.querySelectorAll("li.h-position-r")) {
                if (liElement.classList.contains("itsl-cb-stream-item-lightbulletin")) {
                    const author = liElement.querySelector(".itsl-notifications-person").innerText
                    const course = liElement.querySelector("a span").innerText
                    let date = liElement.querySelector(".itsl-cb-stream-item-timestamp span").innerText
                    date = date.charAt(0).toUpperCase() + date.slice(1)
                    const message = liElement.querySelector(".itsl-light-bulletins-list-item-text").innerText
                    const element = document.createElement("li")
                    element.classList.add("rh--news")
                    element.innerHTML = `
                    <div class="rh--news--content">
                        <span class="rh--news--course">${course}</span>
                        <div>
                            <p class="rh--news--paragraph">Un nouveau message a été publié à ce cours.</p>
                            <span class="rh--news--date">${date}</span>
                        </div>
                        <span class="rh--news--author">
                            <span class="material-icons-round">account_circle</span>
                            ${author}
                        </span>
                    </div>
                    <div class="rh--news--message">${message}</div>`
                    liElement.replaceWith(element)
                } else {
                    const author = liElement.querySelector(".itsl-notifications-person").innerText
                    const course = liElement.querySelector(".itsl-notifications-location-title").innerText
                    let date = liElement.querySelector(".itsl-cb-stream-item-timestamp span").innerText
                    date = date.charAt(0).toUpperCase() + date.slice(1)
                    const elements = []
                    for (const aElement of tabs[1].element.querySelectorAll("img + a")) {
                        const imgElement = aElement.previousElementSibling
                        const element = { name: aElement.innerText, icon: imgElement.src, link: aElement.href }
                        elements.push(element)
                    }
                    let more = liElement.querySelector("a[onclick]") === null ? false : true
                    const element = document.createElement("li")
                    element.classList.add("rh--news")
                    element.innerHTML = `
                        <div class="rh--news--content">
                            <span class="rh--news--course">${course}</span>
                            <div>
                                <p class="rh--news--paragraph">Du contenu a été ajouté à ce cours.</p>
                                <span class="rh--news--date">${date}</span>
                            </div>
                            <span class="rh--news--author">
                                <span class="material-icons-round">account_circle</span>
                                ${author}
                            </span>
                        </div>
                        <div class="rh--news--elements">
                            ${elements.map(element => `
                                <a class="rh--news--element" href="${element.link}">
                                    <img class="rh--news--element--icon" src="${element.icon}" alt="">
                                    <span class="rh--news--element--name">${element.name}</span>
                                </a>`).join("")}
                            ${more ? `<a class="rh--news--element" href="#">
                                <span class="rh--news--element--icon material-icons-round">more_horiz</span>
                                <span class="rh--news--element--name">Voir tous les éléments</span>
                            </a>` : ""}
                        </div>`
                    liElement.replaceWith(element)
                }
            }

            const tabDisplay = document.createElement("div")
            tabDisplay.classList.add("rh--tabDisplay")
            content.appendChild(tabDisplay)

            function changeTab(tab) {
                const selectedTab = tabs.find(t => t.selected)
                if (selectedTab) {
                    delete selectedTab.selected
                    selectedTab.navbarElement.classList.remove("tab__selected")
                }
                tab.selected = true
                tabDisplay.innerHTML = ""
                tabDisplay.appendChild(tab.element)
                tabDisplay.setAttribute("tabId", tab.id)
                tab.navbarElement.classList.add("tab__selected")
            }

            // TODO: Change back to tabs[0] (changed for testing purposes)
            changeTab(tabs[1])

        }
    }
})()