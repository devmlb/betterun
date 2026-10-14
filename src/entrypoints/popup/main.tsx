import React from "react";
import ReactDOM from "react-dom/client";
import "mdui/mdui.css";
import "mdui";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "material-icons/iconfont/round.css";
import "./style.css";
import PopupApp from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <PopupApp />
    </React.StrictMode>,
);
