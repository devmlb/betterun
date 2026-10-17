import React, { useEffect, useState } from "react";
import { setColorScheme } from "mdui";

import type { Mod, Structure, ExtensionStorage } from "../../types/betterun";
import SettingsPage from "./SettingsPage";
import ModCategoryPage from "./ModCategoryPage";
import { useStorage } from "./hooks/useStorage";

type ActivePage = "home" | "settings" | string; // string = category page id

export default function PopupApp() {
    const [activePage, setActivePage] = useState<ActivePage>("home");
    const [structure, setStructure] = useState<Structure>([]);
    const [mods, setMods] = useState<Mod[]>([]);
    const [storage, setStorage] = useStorage<ExtensionStorage>(null, {});

    const extensionEnabled = !!(storage as ExtensionStorage)["gbs-enabled"];

    // Initialise MDUI colour scheme and load JSON data
    useEffect(() => {
        setColorScheme("#3452ff");

        Promise.all([
            fetch(browser.runtime.getURL("/structure.json")).then((r) =>
                r.json(),
            ),
            fetch(browser.runtime.getURL("/mods.json")).then((r) => r.json()),
        ]).then(([s, m]: [Structure, Mod[]]) => {
            setStructure(s);
            setMods(m);
        });
    }, []);

    // Fade body in once everything is loaded
    useEffect(() => {
        if (structure.length > 0 && mods.length > 0) {
            const timer = setTimeout(
                () => document.body.classList.add("ready"),
                160,
            );
            return () => clearTimeout(timer);
        }
    }, [structure, mods]);

    const handleExtensionToggle = async () => {
        const newState = !extensionEnabled;
        console.info(
            newState ? "Enabling the extension" : "Disabling the extension",
        );
        await browser.storage.sync.set({ "gbs-enabled": newState });
    };

    const isHomeActive = activePage !== "home";

    return (
        <>
            {/* Home page */}
            <div
                id="home-page"
                className={`page${isHomeActive ? " swipe-left" : ""}`}
            >
                <header>
                    <img src="/icons/icon-256.png" alt="BetterUN logo" />
                    <h1>BetterUN</h1>
                    <span className="growing-space" />
                    <mdui-button-icon
                        id="settings-btn"
                        icon="more_vert--rounded"
                        onClick={() => setActivePage("settings")}
                    />
                </header>
                <div className="content">
                    {/* Enable / disable extension card */}
                    <mdui-card
                        id="enable-switch"
                        variant="filled"
                        clickable
                        onClick={handleExtensionToggle}
                    >
                        <p>Activer l'extension</p>
                        <mdui-switch checked={extensionEnabled || undefined} />
                    </mdui-card>

                    {/* Mod category links */}
                    <section id="mods-list">
                        <h3>Mods</h3>
                        {structure.map((page) => (
                            <mdui-card
                                key={page.id}
                                id={`${page.id}-btn`}
                                className="mod-link"
                                clickable
                                variant="filled"
                                onClick={() => setActivePage(page.id)}
                            >
                                <p>{page.name}</p>
                                <i className="material-icons-round">
                                    arrow_right
                                </i>
                            </mdui-card>
                        ))}
                    </section>
                </div>
            </div>

            {/* Settings page */}
            <SettingsPage
                active={activePage === "settings"}
                onBack={() => setActivePage("home")}
            />

            {/* Dynamic mod category pages */}
            {structure.map((page) => (
                <ModCategoryPage
                    key={page.id}
                    pageId={page.id}
                    pageName={page.name}
                    sections={page.sections}
                    mods={mods}
                    storage={storage as ExtensionStorage}
                    extensionEnabled={extensionEnabled}
                    active={activePage === page.id}
                    onBack={() => setActivePage("home")}
                />
            ))}
        </>
    );
}
