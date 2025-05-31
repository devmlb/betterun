async function getExtensionStorage(key = null) {
    return await chrome.storage.sync.get(key);
}

async function injectFont() {
    const font = new FontFace("Material Icons Round", `url(${chrome.runtime.getURL("/internal/res/fonts/material-icons-round.woff2")})`, {
        style: "normal",
        weight: "400"
    });
    document.fonts.add(font);
    font.load();
}

async function injectCssFiles() {
    test = await getExtensionStorage();
    let link = document.createElement('link');
    link.href = chrome.runtime.getURL('internal/test-style.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    // TODO
}

injectFont();

document.addEventListener("readystatechange", () => {
    if (document.readyState === "interactive") {
        injectCssFiles();
    }
});

// window.postMessage({ betterun: chrome.runtime.getURL('internal/test-script.js') })

// window.addEventListener("message", (event) => {
//     if (event.data.betterunClient) {
//         console.log("success")
//     }
// });
// TODO