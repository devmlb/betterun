(function () {
    // Adds an indicator when there is no result
    const groupsList = document.querySelector(".groups-list");
    if (!groupsList) return;

    const noResult = document.createElement("span");
    noResult.innerText = "Aucun résultat";
    noResult.style.display = "none";
    groupsList.append(noResult);

    // Creates the popup
    const popup = document.createElement("div");
    popup.id = "popup";
    const groupsListPopup = document.createElement("div");
    groupsListPopup.id = "groups-list-popup";
    groupsListPopup.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 40px;">
        <h4 style="flex-grow: 1; margin-block: 0px;">Sélectionner des groupes</h4>
        <button id="popup-close-button" class="un-button un-button-filled un-icon-button" type="button"><i class="material-icons-round">close</i></button>
    </div>
    <input id="groups-search" class="un-input" type="text" placeholder="Filtrer les groupes">
    `;
    const selectedGroupsTags = document.createElement("div");
    selectedGroupsTags.id = "selected-groups";
    groupsListPopup.appendChild(groupsList);
    groupsList.classList.add("ready");
    popup.appendChild(groupsListPopup);
    document.body.appendChild(popup);

    // Creates the selection button and tag group
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "groups-header";
    const sectionTitle = document.createElement("h5");
    sectionTitle.textContent = "Groupes sélectionnés";
    const groupsButton = document.createElement("button");
    groupsButton.id = "groups-button";
    groupsButton.className = "un-button un-button-filled un-icon-button";
    groupsButton.innerHTML = '<i class="material-icons-round">add</i>';
    sectionHeader.append(sectionTitle, groupsButton);

    const sidebarColumns = document.querySelector("#sidebar>.columns");
    if (sidebarColumns) {
        sidebarColumns.append(sectionHeader, selectedGroupsTags);
    }

    // Prepares checkbox selection
    const groupsContainer = document.querySelector(
        "#desktopGroupForm>#educational_groups",
    );
    if (!groupsContainer) return;

    const checkboxes = groupsContainer.querySelectorAll<HTMLInputElement>(
        "input[type=checkbox]",
    );

    // Creates groups tags on loading and requests the corresponding timetables
    let selectedGroupTag: HTMLButtonElement;
    Object.keys(localStorage).forEach((key) => {
        const label = groupsContainer.querySelector<HTMLLabelElement>(
            'label[for="' + key + '"]',
        );
        if (!label) {
            localStorage.removeItem(key);
            return;
        }

        selectedGroupTag = document.createElement("button");
        try {
            label.click();
        } catch {
            localStorage.removeItem(key);
            return;
        }
        selectedGroupTag.classList.add("selected-group");
        selectedGroupTag.innerHTML =
            '<i class="fa fa-trash" style="margin-right: 6px;"></i>' +
            (label.textContent ?? "");
        selectedGroupTag.id = "selected-group-tag-" + key;
        document
            .querySelector("#selected-groups")
            ?.appendChild(selectedGroupTag);
        label.classList.add("selected");

        selectedGroupTag.addEventListener("click", () => {
            label.click();
            const tag = document.querySelector("#selected-group-tag-" + key);
            if (tag) {
                document.querySelector("#selected-groups")?.removeChild(tag);
            }
            label.classList.remove("selected");
            localStorage.removeItem(key);
        });
    });

    // Adds an event listener for checkboxes in all groups
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            const target = event.currentTarget as HTMLInputElement | null;
            if (target?.checked) {
                const label = groupsContainer.querySelector<HTMLLabelElement>(
                    'label[for="' + checkbox.id + '"]',
                );
                if (!label) return;

                const tag = document.createElement("button");
                tag.classList.add("selected-group");
                tag.innerHTML =
                    '<i class="fa fa-trash" style="margin-right: 6px;"></i>' +
                    (label.textContent ?? "");
                tag.id = "selected-group-tag-" + checkbox.id;
                document.querySelector("#selected-groups")?.appendChild(tag);
                label.classList.add("selected");
                localStorage.setItem(checkbox.id, "");

                tag.addEventListener("click", () => {
                    label.click();
                    const existingTag = document.querySelector(
                        "#selected-group-tag-" + checkbox.id,
                    );
                    if (existingTag) {
                        document
                            .querySelector("#selected-groups")
                            ?.removeChild(existingTag);
                    }
                    label.classList.remove("selected");
                    localStorage.removeItem(checkbox.id);
                });
            }
        });
    });

    // Group search
    const searchBox = document.querySelector<HTMLInputElement>("#groups-search");
    const results = groupsContainer.querySelectorAll<HTMLLabelElement>("label");
    let groupNumber: string;
    let resultsNumber: number;
    let search: string;

    searchBox?.addEventListener("input", () => {
        search = searchBox.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f\s]/g, "");
        resultsNumber = 0;
        results.forEach((result) => {
            if (!result.classList.contains("selected")) {
                groupNumber = (result.textContent ?? "")
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f\s]/g, "");
                if (!groupNumber.includes(search)) {
                    result.classList.add("hidden-result");
                } else {
                    resultsNumber++;
                    result.classList.remove("hidden-result");
                }
            }
        });
        noResult.style.display = resultsNumber > 0 ? "none" : "block";
    });

    // Shows the popup
    groupsButton.addEventListener("click", () => {
        popup.classList.add("show");
    });

    // Closes the pop-up window when you click outside or press the close button
    popup.addEventListener("click", function (event) {
        if (!groupsListPopup.contains(event.target as Node)) {
            popup.classList.remove("show");
        }
    });
    document
        .querySelector("#popup-close-button")
        ?.addEventListener("click", () => {
            popup.classList.remove("show");
        });
})();
