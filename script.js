function detectBrowser() {
    const userAgent = navigator.userAgent;

    if (/firefox|fxios/i.test(userAgent)) {
        return 'ffx';
    } else if (/edg/i.test(userAgent)) {
        return 'edg';
    } else if (/chrome|chromium|crios/i.test(userAgent) && !/edg/i.test(userAgent)) {
        return 'chr';
    } else if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) {
        return 'sfr';
    } else if (/opr|opera/i.test(userAgent)) {
        return 'opr';
    } else {
        return 'ukw';
    }
}

function getBrowserInList(browserList, browserId) {
    for (const browser of browserList) {
        if (browser.id == browserId) {
            return browser;
        }
    }
}

function setDownloadButton(browserName, browserIcon, accentColor, downloadLink) {
    downloadBtnLabel.textContent = 'Installer BetterUN pour ' + browserName;
    downloadBtnIcon.setAttribute('src', browserIcon);
    downloadBtnIcon.classList = 'grow';
    if (downloadLink === "") {
        downloadBtn.setAttribute('disabled', '');
        try {
            downloadBtn.removeAttribute('onclick', `window.location = '${downloadLink}'`);
        } catch { }
    } else {
        downloadBtn.setAttribute('onclick', `window.location = '${downloadLink}'`);
        try {
            downloadBtn.removeAttribute('disabled', '');
        } catch { }
    }
    mdui.setColorScheme(accentColor, { target: downloadBtn });
    setTimeout(() => {
        downloadBtnIcon.classList = '';
    }, 300);
}

async function getFFDownloadLink() {
    const response = await (await fetch('https://devmlb.github.io/betterun/api/update/manifest.json')).json();
    const releasesList = response['addons']['betterun@devmlb']['updates'];
    const release = releasesList[releasesList.length - 1]
    return release.update_link;
}

function initDownloadButton(browsers) {
    const currentBrowser = getBrowserInList(browsers, detectBrowser());
    setDownloadButton(currentBrowser.name, currentBrowser.icon, currentBrowser.accentColor, currentBrowser.link);

    browsers.forEach(browser => {
        document.querySelector(`#${browser.id}-chip`).addEventListener('click', () => {
            setDownloadButton(browser.name, browser.icon, browser.accentColor, browser.link);
        });
    });
}

async function initBrowsersList() {
    const browsers = [
        { id: 'chr', name: 'Chrome', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg', accentColor: '#fbc015', width: 90, link: "https://chromewebstore.google.com/detail/betterun/ejipemdfoclgepipfifgjkgijglolpgd", updateLink: "" },
        { id: 'ffx', name: 'Firefox', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg', accentColor: '#ff8131', width: 79, link: await getFFDownloadLink(), updateLink: "" },
        { id: 'edg', name: 'Edge', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg', accentColor: '#2dc2da', width: 59, link: "", updateLink: "" },
        { id: 'opr', name: 'Opera', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Opera_2015_icon.svg', accentColor: '#ff1b2d', width: 69, link: "", updateLink: "" }
    ];
    initDownloadButton(browsers);
}

document.addEventListener("DOMContentLoaded", function () {
    mdui.setColorScheme('#3452ff');
});


const downloadBtn = document.querySelector('#download-btn');
const downloadBtnIcon = downloadBtn.querySelector('img');
const downloadBtnLabel = downloadBtn.querySelector('h2');

initBrowsersList();

document.querySelector('body').classList.add('ready');