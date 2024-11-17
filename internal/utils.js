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