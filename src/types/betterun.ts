export type FrameOption = "all" | "main";

export interface Mod {
    id: string;
    title: string;
    desc: string;
    frame: FrameOption;
    enabled: boolean;
    chromiumFiles: string[];
    firefoxFiles: string[];
    matches: string[];
    version: string;
    hidden: boolean;
    pageId: string;
    sectionId: string;
    defaultState?: boolean;
}

export interface StoredModSettings {
    frame: FrameOption;
    chromiumFiles: string[];
    firefoxFiles: string[];
    matches: string[];
    enabled: boolean;
}

export interface StructurePage {
    id: string;
    name: string;
    sections: Record<string, string>;
}

export type Structure = StructurePage[];

export interface ExtensionStorage {
    "gbs-enabled"?: boolean;
    "gbs-updated"?: boolean;
    [key: `mod-${string}`]: StoredModSettings;
    [key: string]: any;
}
