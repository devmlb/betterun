import { defineWxtModule } from "wxt/modules";
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";

async function buildMods(wxt: any) {
    const srcModsDir = path.resolve(wxt.config.srcDir, "mods");
    const outModsDir = path.resolve(wxt.config.outDir, "mods");

    if (!fs.existsSync(srcModsDir)) return;

    // Recursively gather all files in src/mods
    function getFiles(dir: string): string[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const files: string[] = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...getFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        return files;
    }

    const allFiles = getFiles(srcModsDir);
    const tsFiles: string[] = [];
    const staticFiles: string[] = [];

    for (const file of allFiles) {
        if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
            tsFiles.push(file);
        } else {
            staticFiles.push(file);
        }
    }

    // 1. Copy static assets (.css, .svg, etc.)
    for (const file of staticFiles) {
        const rel = path.relative(srcModsDir, file);
        const dest = path.join(outModsDir, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
    }

    // 2. Build TypeScript mods as IIFEs in parallel
    await Promise.all(
        tsFiles.map(async (file) => {
            const rel = path.relative(srcModsDir, file);
            const targetRel = rel.replace(/\.ts$/, ".js");
            const targetFile = path.join(outModsDir, targetRel);
            const targetDir = path.dirname(targetFile);
            const targetName = path.basename(targetFile);

            await build({
                configFile: false,
                publicDir: false,
                logLevel: "silent",
                build: {
                    write: true,
                    emptyOutDir: false,
                    outDir: targetDir,
                    lib: {
                        entry: file,
                        formats: ["iife"],
                        name: "Mod",
                        fileName: () => targetName,
                    },
                },
            });
        }),
    );
}

export default defineWxtModule({
    name: "betterun:mods",
    setup(wxt) {
        wxt.hooks.hook("build:done", async () => {
            await buildMods(wxt);
        });

        wxt.hooks.hook("server:started", (wxt, server) => {
            server.watcher.on("all", async (_event, file) => {
                if (file.includes(path.join("src", "mods"))) {
                    await buildMods(wxt);
                    server.reloadExtension();
                }
            });
        });
    },
});
