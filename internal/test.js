// const p = new bun("Caroline");
// p.greet(); // Hello, my name is Caroline

// console.log(chrome.runtime.getURL('internal/test-script.js'))

window.addEventListener("message", (event) => {
    if (event.data.betterun) {
        console.log(event)
        window.postMessage({ betterunClient: "received" })
    }
});