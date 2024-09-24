const updateIframeURL = chrome.runtime.getURL("update.html");
let iframe = document.createElement("iframe");
// iframe.setAttribute('src', updateIframeURL);
let html = `
<!doctype html>
<html class="mdui-theme-auto" style="background-color: transparent; width: 100vw; height: 100vh;">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="%mdui-css%">
    <script src="%mdui-js%"></script>
    <link href="%material-icons-css%" rel="stylesheet">
    <link href="%roboto-css%" rel="stylesheet">
    <style>
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background-color: rgb(var(--mdui-color-surface-container-highest));
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: rgb(var(--mdui-color-primary));
            border-radius: 10px;
        }

        body {
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            font-style: normal;
            padding: 10px;
            width: 350px;
        }

        .material-symbols-rounded {
            font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24
        }

        p,
        a, 
        li {
            font-size: 14px;
            color: var(--mdui-color-on-surface);
        }

        p {
            margin-block-start: 0px;
            margin-block-end: 0px;
        }

        li {
            margin-bottom: 10px;
        }

        p:not(.checkbox-title, .checkbox-desc) {
            white-space: nowrap;
        }

        a {
            text-decoration: none;
            color: var(--mdui-color-on-surface);
        }

        mdui-card {
            padding: 15px;
            width: 100%;
        }
    </style>
    <script>
    document.addEventListener("DOMContentLoaded", function () {
        mdui.setColorScheme('#f47920');
        closeButton = document.getElementById("close-btn");
        closeButton.addEventListener("click", function() {
            window.top.postMessage('close', '*');
        });
    });
    </script>
</head>

<body>
    <mdui-card variant="elevated"
        style="padding: 20px; display: flex; width: auto; align-items: center; position: fixed; bottom: 20px; right: 20px;">
        <img src="%itsbetter-icon%" style="width: 50px; height: 50px; margin-right: 30px;">
        <div>
            <h1 style="margin-block-start: 10px; margin-block-end: 0px;">ItsBetter a été mise à jour !</h1>
            <div style="display: flex; align-items: center;">
                <mdui-icon name="new_releases--rounded" style="margin-right: 10px;"></mdui-icon>
                <h2>Nouveautés (v%version%)</h2>
            </div>
            <ul style="margin-bottom: 20px;">
                %new-features%
            </ul>
            <div style="display: flex; width: auto; align-items: center; justify-content: right;">
                <mdui-button id="close-btn" style="margin-right: 5px;">Fermer</mdui-button>
            </div>
        </div>
    </mdui-card>
</body>

</html>
`

let newFeaturesList = ""
fetch("https://devmlb.github.io/itsbetter/release.json").then(function (response) {
    return response.json();
}).then(function (newRelease) {
    for (const feature of newRelease["new-features"]) {
        newFeaturesList += "<li>"+feature+"</li>"
    }

    html = html.replace("%new-features%", newFeaturesList);
    html = html.replace("%version%", chrome.runtime.getManifest().version);

    html = html.replace("%mdui-css%", chrome.runtime.getURL("/mdui/mdui.css"));
    html = html.replace("%mdui-js%", chrome.runtime.getURL("/mdui/mdui.global.js"));
    html = html.replace("%material-icons-css%", chrome.runtime.getURL("/mdui/material-icons-round.css"));
    html = html.replace("%roboto-css%", chrome.runtime.getURL("/mdui/roboto.css"));
    html = html.replace("%itsbetter-icon%", chrome.runtime.getURL("/internal/icons/itsbetter-icon-128.png"));

    iframe.setAttribute('srcdoc', html)
    // iframe.setAttribute('id', "itsbetter-update-msg");
    iframe.setAttribute('style', "border-style: none; width: 100vw; height: 100vh;");
    let div = document.createElement("div");
    div.setAttribute('style', "z-index: 999; position: fixed; bottom: 0px; right: 0px; background-color: rgba(0, 0, 0, .3);");
    div.appendChild(iframe);
    div.setAttribute('id', 'itsbetter-update-msg');
    const body = document.querySelector('body');
    body.appendChild(div);
});

// iframe.onload()

// iframe.addEventListener("DOMContentLoaded", function () {
//     iframe.contentWindow.postMessage("test", "*");
// });
// setTimeout(() => {
//     iframe.contentWindow.postMessage("test", "*");
// }, 1000);
window.onmessage = function(e) {
    if (e.data == 'close') {
        document.getElementById('itsbetter-update-msg').remove()
    }
};