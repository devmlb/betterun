import { useState, useEffect } from "react";

/**
 * Hook to read a single key from browser.storage.sync reactively.
 * Pass null to get all keys.
 */
export function useStorage<T>(key: string | null, defaultValue: T) {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        const load = () => {
            browser.storage.sync.get(key).then((result) => {
                setValue(key ? (result[key] ?? defaultValue) : (result as T));
            });
        };

        load();

        const listener = (
            changes: Record<string, browser.storage.StorageChange>,
        ) => {
            if (!key || key in changes) {
                load();
            }
        };

        browser.storage.onChanged.addListener(listener);
        return () => browser.storage.onChanged.removeListener(listener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return [value, setValue] as const;
}
