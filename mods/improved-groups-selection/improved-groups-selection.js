(function () {
    // Adds an indicator when there is no result
    const groupsList = document.querySelector('.groups-list');
    const noResult = document.createElement('span');
    noResult.innerText = 'Aucun résultat';
    noResult.style.display = 'none';
    groupsList.append(noResult);
    
    // Creates the popup
    const popup = document.createElement('div');
    popup.id = 'popup';
    const groupsListPopup = document.createElement('div');
    groupsListPopup.id = 'groups-list-popup';
    groupsListPopup.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 40px;">
        <h4 style="flex-grow: 1; margin-block: 0px;">Sélectionner des groupes</h4>
        <button id="popup-close-button" class="un-button un-button-filled un-icon-button" type="button"><i class="material-icons-round">close</i></button>
    </div>
    <input id="groups-search" class="un-input" type="text" placeholder="Filtrer les groupes">
    `;
    const selectedGroupsTags = document.createElement('div');
    selectedGroupsTags.id = 'selected-groups';
    groupsListPopup.appendChild(groupsList);
    groupsList.classList.add('ready');
    popup.appendChild(groupsListPopup);
    document.querySelector('body').appendChild(popup);

    // Creates the selection button and tag group
    const groupsButton = document.createElement('button');
    groupsButton.id = 'groups-button';
    groupsButton.textContent = 'Sélectionner des groupes';
    groupsButton.classList = 'un-button un-button-filled';
    document.querySelector('#sidebar>.columns').append(groupsButton, selectedGroupsTags);

    // Prepares checkbox selection
    const groupsContainer = document.querySelector('#desktopGroupForm>#educational_groups');
    const checkboxes = groupsContainer.querySelectorAll('input[type=checkbox]');

    // Creates groups tags on loading and requests the corresponding timetables
    let selectedGroupTag;
    Object.keys(localStorage).forEach((key) => {
        selectedGroupTag = document.createElement('button');
        groupsContainer.querySelector('label[for="' + key + '"]').click();
        selectedGroupTag.classList.add('selected-group');
        selectedGroupTag.innerHTML = '<i class="fa fa-trash" style="margin-right: 6px;"></i>' + groupsContainer.querySelector('label[for="' + key + '"]').textContent;
        selectedGroupTag.id = 'selected-group-tag-' + key;
        document.querySelector('#selected-groups').appendChild(selectedGroupTag);
        groupsContainer.querySelector('label[for="' + key + '"]').classList.add('selected');
        selectedGroupTag.addEventListener('click', () => {
            groupsContainer.querySelector('label[for="' + key + '"]').click();
            document.querySelector('#selected-groups').removeChild(document.querySelector('#selected-group-tag-' + key));
            groupsContainer.querySelector('label[for="' + key + '"]').classList.remove('selected');
            localStorage.removeItem(key);
        });
    });

    // Adds an event listener for checkboxes in all groups
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                selectedGroupTag = document.createElement('button');
                selectedGroupTag.classList.add('selected-group');
                selectedGroupTag.innerHTML = '<i class="fa fa-trash" style="margin-right: 6px;"></i>' + groupsContainer.querySelector('label[for="' + checkbox.id + '"]').textContent;
                selectedGroupTag.id = 'selected-group-tag-' + checkbox.id;
                document.querySelector('#selected-groups').appendChild(selectedGroupTag);
                groupsContainer.querySelector('label[for="' + checkbox.id + '"]').classList.add('selected');
                localStorage.setItem(checkbox.id, "");
                selectedGroupTag.addEventListener('click', () => {
                    groupsContainer.querySelector('label[for="' + checkbox.id + '"]').click();
                    document.querySelector('#selected-groups').removeChild(document.querySelector('#selected-group-tag-' + checkbox.id));
                    groupsContainer.querySelector('label[for="' + checkbox.id + '"]').classList.remove('selected');
                    localStorage.removeItem(checkbox.id);
                });
            }
        });
    });

    // Group search
    const searchBox = document.querySelector('#groups-search');
    const results = groupsContainer.querySelectorAll('label');
    let groupNumber, resultsNumber, search;
    searchBox.addEventListener("input", () => {
        search = searchBox.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g, '');
        resultsNumber = 0;
        results.forEach((result) => {
            if (!result.classList.contains('selected')) {
                groupNumber = result.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g, '');
                if (!groupNumber.includes(search)) {
                    result.classList.add('hidden-result');
                } else {
                    resultsNumber++;
                    result.classList.remove('hidden-result');
                }
            }
        });
        noResult.style.display = resultsNumber > 0 ? 'none' : 'block';
    });

    // Shows the popup
    groupsButton.addEventListener('click', () => {
        popup.classList.add('show');
    });

    // Closes the pop-up window when you click outside or press the close button
    popup.addEventListener('click', function (event) {
        if (!groupsListPopup.contains(event.target)) {
            popup.classList.remove('show');
        }
    });
    document.querySelector('#popup-close-button').addEventListener('click', () => {
        popup.classList.remove('show');
    });
})();