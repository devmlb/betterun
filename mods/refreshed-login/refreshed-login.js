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