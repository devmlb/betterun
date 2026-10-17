export class Logger {
    scriptName: string;

    constructor(scriptName: string) {
        this.scriptName = scriptName;
    }

    log(...args: unknown[]) {
        console.log(`[BetterUN][${this.scriptName}]`, ...args);
    }

    warn(...args: unknown[]) {
        console.warn(`[BetterUN][${this.scriptName}]`, ...args);
    }

    error(...args: unknown[]) {
        console.error(`[BetterUN][${this.scriptName}]`, ...args);
    }
}
