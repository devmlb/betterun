const font = new FontFace("Material Icons Round", `url(${chrome.runtime.getURL('/internal/material-icons-round.woff2')})`, {
    style: "normal",
    weight: "400"
});
document.fonts.add(font);
font.load();