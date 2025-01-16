async function getExtensionStorage(key = null) {
    const storage = await chrome.storage.sync.get(key);
    return storage;
}

async function injectContent(func) {
    document.onreadystatechange = async () => {
        if (document.readyState === "interactive") {
            document.body.style.opacity = '0';
            await injectCSS();
            // func();
            document.body.style.opacity = '1';
        }
    };
}

async function injectCSS() {
    test = await getExtensionStorage();
    let link = document.createElement('link');
    link.href = chrome.runtime.getURL('internal/test-style.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'all';
    document.head.appendChild(link);
}


const font = new FontFace("Material Icons Round", `url(${chrome.runtime.getURL('/internal/material-icons-round.woff2')})`, {
    style: "normal",
    weight: "400"
});
document.fonts.add(font);
font.load();

class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}