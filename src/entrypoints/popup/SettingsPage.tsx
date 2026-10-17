import React from "react";

interface SettingsPageProps {
    active: boolean;
    onBack: () => void;
}

export default function SettingsPage({ active, onBack }: SettingsPageProps) {
    const version = "v" + browser.runtime.getManifest().version;

    return (
        <div
            id="settings-page"
            className={`page${active ? " swipe-left" : ""}`}
        >
            <header>
                <mdui-button-icon
                    className="back-btn"
                    icon="arrow_back--rounded"
                    onClick={onBack}
                />
                <h2>À propos</h2>
                <span className="growing-space" />
            </header>
            <div className="content">
                <section id="about-section">
                    <mdui-card className="mods-card" variant="filled">
                        <h1 id="release-version">{version}</h1>
                        <p>
                            BetterUN est développée par{" "}
                            <a
                                href="https://github.com/devmlb"
                                target="_blank"
                                rel="noreferrer"
                            >
                                @devmlb
                            </a>
                            .
                        </p>
                        <p>
                            Cette extension n'est pas affiliée, associée, ou en
                            aucun cas officiellement liée à Nantes Université.
                        </p>
                        <p>
                            BetterUN est un projet open source disponible sous
                            licence GNU General Public License v3.0.
                        </p>
                        <mdui-divider />
                        <p>
                            Aucune donnée personnelle ou statistique appartenant
                            à l'utilisateur n'est collectée par l'extension.
                        </p>
                    </mdui-card>
                </section>
                <section className="buttons-list">
                    <mdui-button
                        icon="public--rounded"
                        full-width
                        href="https://devmlb.github.io/betterun/"
                        target="_blank"
                        variant="outlined"
                    >
                        Visiter le site
                    </mdui-button>
                    <mdui-button
                        icon="code--rounded"
                        full-width
                        href="https://github.com/devmlb/bun/"
                        target="_blank"
                        variant="outlined"
                    >
                        Voir sur Github
                    </mdui-button>
                </section>
            </div>
        </div>
    );
}
