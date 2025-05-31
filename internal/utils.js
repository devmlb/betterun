async function preloadJS() {
    test = await getExtensionStorage();
    setTimeout(() => {
        let link = document.createElement('script');
        link.src = chrome.runtime.getURL('internal/test-script.js');
        link.type = 'text/javascript';
        JSPreload.nodes.push(link);
        JSPreload.finished = true;
    }, 2000);
}

async function getExtensionStorage(key = null) {
    const storage = await chrome.storage.sync.get(key);
    return storage;
}

async function injectContent(func) {
    document.onreadystatechange = async () => {
        if (document.readyState === "interactive") {
            let start = new Date();
            console.log("start", start);
            document.body.style.opacity = '0';
            await injectCSS();
            injectJS();
            // func();
            document.body.style.opacity = '1';
            console.log("end", new Date() - start);
        }
    };
}

async function injectCSS() {
    test = await getExtensionStorage();
    let link = document.createElement('link');
    link.href = chrome.runtime.getURL('internal/test-style.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

function injectJS() {
    // while (!JSPreload.finished) { };
    // JSPreload.nodes.forEach(node => document.head.appendChild(node))
    let link = document.createElement('script');
    link.src = chrome.runtime.getURL('internal/test-script.js');
    link.type = 'text/javascript';
    document.head.appendChild(link);

    // TODO: inject CSS files with this function and JS files with registerContentScript (world MAIN)
}

const JSPreload = { finished: false, nodes: [] };
preloadJS();
injectContent();

const font = new FontFace("Material Icons Round", `url(${chrome.runtime.getURL('/internal/res/fonts/material-icons-round.woff2')})`, {
    style: "normal",
    weight: "400"
});
document.fonts.add(font);
font.load();

window.postMessage({ betterun: chrome.runtime.getURL('internal/test-script.js') })

window.addEventListener("message", (event) => {
    if (event.data.betterunClient) {
        console.log("success")
    }
});