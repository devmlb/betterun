// TODO: clean the code
(function () {
    const groupsList = document.querySelector('.groups-list');
    const searchBox = document.querySelector('#searchBox');
    searchBox.querySelector('i').remove();
    const groupsListPopup = document.createElement('div');
    const popup = document.createElement('div');
    const groupsButton = document.createElement('button');
    groupsButton.id = 'groups-button';
    groupsButton.textContent = 'Sélectionner des groupes';
    groupsButton.classList.add('button');
    popup.id = 'popup';
    groupsListPopup.id = 'groups-list-popup';
    groupsListPopup.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <h4 style="flex-grow: 1; margin-block: 0px;">Sélectionner des groupes</h4>
        <button id="popup-close-button" class="button" style="margin: 0px;"><i class="fa fa-close" style="margin-right: 6px;"></i>Fermer</button>    
    </div>
    `;
    selectedGroupsTags = document.createElement('div');
    selectedGroupsTags.id = 'selected-groups';
    groupsListPopup.appendChild(searchBox);
    groupsListPopup.appendChild(groupsList);
    searchBox.classList.add('ready');
    groupsList.classList.add('ready');
    popup.appendChild(groupsListPopup);
    document.querySelector('body').appendChild(popup);
    document.querySelector('#sidebar>.columns').appendChild(groupsButton);
    document.querySelector('#sidebar>.columns').appendChild(selectedGroupsTags);
    const groupsContainer = document.querySelector('#desktopGroupForm>#educational_groups');
    const checkboxes = groupsContainer.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                const selectedGroupTag = document.createElement('button');
                selectedGroupTag.classList.add('selected-group');
                selectedGroupTag.innerHTML = '<i class="fa fa-trash" style="margin-right: 6px;"></i>' + groupsContainer.querySelector('label[for="' + checkbox.id + '"]').textContent;
                selectedGroupTag.id = 'selected-group-tag-' + checkbox.id;
                document.querySelector('#selected-groups').appendChild(selectedGroupTag);
                groupsContainer.querySelector('label[for="' + checkbox.id + '"]').style.display = 'none';
                selectedGroupTag.addEventListener('click', () => {
                    groupsContainer.querySelector('label[for="' + checkbox.id + '"]').click();
                    document.querySelector('#selected-groups').removeChild(document.querySelector('#selected-group-tag-' + checkbox.id));
                    groupsContainer.querySelector('label[for="' + checkbox.id + '"]').style.display = 'block';
                });
            }
        });
    });
    groupsButton.addEventListener('click', () => {
        popup.classList.add('show');
    });
    // popup.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     popup.classList.remove('show');
    // });
    // popup.addEventListener('click', function (event) {
    //     if (!groupsListPopup.contains(event.target)) {
    //         // click outside the popup
    //         console.log('click outside')
    //         popup.classList.remove('show');
    //     }
    // });
    document.querySelector('#popup-close-button').addEventListener('click', () => {
        console.log('close btn')
        popup.classList.remove('show');
    });
})();