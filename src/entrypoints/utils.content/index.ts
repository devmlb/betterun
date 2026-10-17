import "./style.css";
import fontWoff2Url from "material-icons/iconfont/material-icons-round.woff2";

export default defineContentScript({
    matches: ["https://*.univ-nantes.fr/*"],
    runAt: "document_start",
    allFrames: true,
    main() {
        const font = new FontFace("Material Icons Round", `url(${fontWoff2Url})`, {
            style: "normal",
            weight: "400",
        });
        document.fonts.add(font);
        font.load();
    },
});
