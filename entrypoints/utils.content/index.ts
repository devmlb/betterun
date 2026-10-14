import "./style.css";
import fontWoff2Url from "material-icons/iconfont/material-icons-round.woff2";

export default defineContentScript({
    matches: ["https://*.univ-nantes.fr/*"],
    runAt: "document_start",
    main() {
        const url =
            typeof fontWoff2Url === "string" &&
            (fontWoff2Url.startsWith("http") ||
                fontWoff2Url.startsWith("chrome-extension://") ||
                fontWoff2Url.startsWith("moz-extension://"))
                ? fontWoff2Url
                : browser.runtime.getURL(fontWoff2Url as any);

        const font = new FontFace("Material Icons Round", `url(${url})`, {
            style: "normal",
            weight: "400",
        });
        document.fonts.add(font);
        font.load();
    },
});
