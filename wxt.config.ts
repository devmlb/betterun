import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    modules: ["@wxt-dev/module-react"],
    suppressWarnings: {
        firefoxDataCollection: true,
    },
    manifest: {
        name: "BetterUN",
        description:
            "Improve your experience on the Nantes Université websites",
        version: "0.1.5",
        permissions: ["storage", "scripting", "webNavigation"],
        host_permissions: ["https://*.univ-nantes.fr/*"],
        action: {
            default_title: "BetterUN",
        },
        icons: {
            16: "/icons/icon-16.png",
            32: "/icons/icon-32.png",
            48: "/icons/icon-48.png",
            128: "/icons/icon-128.png",
        },
        web_accessible_resources: [
            {
                resources: ["mods/*", "icons/*", "assets/*", "*.woff2"],
                matches: ["https://*.univ-nantes.fr/*"],
            },
        ],
        browser_specific_settings: {
            gecko: {
                id: "betterun@devmlb",
                update_url:
                    "https://devmlb.github.io/betterun/api/update/manifest.json",
            },
        },
    },
});
