const formWindow = document.querySelector('.form-wrapper');

const windowHeader = document.createElement('div');
windowHeader.id = 'window-header';

windowHeader.innerHTML = `
<span id="window-header--logo"></span>
<div id="window-header--infos">
<h1>Connexion</h1>
<span>à l'intranet et aux webservices de Nantes Université</span>
</div>
`;

formWindow.prepend(windowHeader);


document.querySelector('#usernameSection label').removeChild(document.querySelector('#username'));
document.querySelector('#passwordSection label').removeChild(document.querySelector('#password'));
const usernameInput = document.createElement('input');
usernameInput.id = 'username';
usernameInput.classList.add('un-input');
usernameInput.setAttribute('placeholder', 'Identifiant');
usernameInput.setAttribute('name', 'username');

const passwordInput = document.createElement('input');
passwordInput.id = 'password';
passwordInput.classList.add('un-input');
passwordInput.setAttribute('placeholder', 'Mot de passe');
passwordInput.setAttribute('name', 'password');
passwordInput.setAttribute('type', 'password');

document.querySelector('#usernameSection').appendChild(usernameInput);
document.querySelector('#passwordSection').appendChild(passwordInput);

const revealPasswordButton = document.createElement('button');
revealPasswordButton.classList = 'un-button un-button-filled';
revealPasswordButton.innerHTML = '<i class="material-icons-round">visibility</i>';
revealPasswordButton.setAttribute('type', 'button');
revealPasswordButton.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text';
    revealPasswordButton.innerHTML = passwordInput.type === 'text' ? '<i class="material-icons-round">visibility_off</i>' : '<i class="material-icons-round">visibility</i>';
});
document.querySelector('#passwordSection').appendChild(revealPasswordButton);