import React from 'react';
import type { Mod, StoredModSettings, ExtensionStorage } from '../../types/betterun';

interface ModCategoryPageProps {
  pageId: string;
  pageName: string;
  sections: Record<string, string>;
  mods: Mod[];
  storage: ExtensionStorage;
  extensionEnabled: boolean;
  active: boolean;
  onBack: () => void;
}

export default function ModCategoryPage({
  pageId,
  pageName,
  sections,
  mods,
  storage,
  extensionEnabled,
  active,
  onBack,
}: ModCategoryPageProps) {
  const handleModChange = async (modStorageKey: string, checked: boolean) => {
    const result = await browser.storage.sync.get(modStorageKey);
    if (result[modStorageKey]) {
      const updated = { ...result[modStorageKey], enabled: checked } as StoredModSettings;
      console.info(`${checked ? 'Enabling' : 'Disabling'} mod ${modStorageKey}`);
      await browser.storage.sync.set({ [modStorageKey]: updated });
    }
  };

  return (
    <div id={pageId} className={`page${active ? ' swipe-left' : ''}`}>
      <header>
        <mdui-button-icon className="back-btn" icon="arrow_back--rounded" onClick={onBack} />
        <h2>{pageName}</h2>
        <div className="growing-space" />
      </header>
      <div className="content">
        {Object.entries(sections).map(([sectionId, sectionName]) => {
          const sectionMods = mods.filter(
            (mod) => mod.pageId === pageId && mod.sectionId === sectionId && !mod.hidden,
          );
          return (
            <section key={sectionId}>
              <h3>{sectionName}</h3>
              <mdui-card variant="filled" id={`${pageId}-${sectionId}`} className="mods-card">
                {sectionMods.map((mod) => {
                  const storageKey = `mod-${mod.id}`;
                  const modSettings = storage[storageKey] as StoredModSettings | undefined;
                  const isEnabled = modSettings?.enabled ?? false;
                  return (
                    <mdui-checkbox
                      key={mod.id}
                      id={storageKey}
                      className="mod-checkbox"
                      checked={isEnabled || undefined}
                      disabled={!extensionEnabled || undefined}
                      onChange={(e) => {
                        handleModChange(storageKey, (e.target as HTMLInputElement).checked);
                      }}
                    >
                      <div className="checkbox-div">
                        <p className="checkbox-title">
                          {mod.title}
                          <mdui-badge variant="large">{mod.version}</mdui-badge>
                        </p>
                        <p className="checkbox-desc">{mod.desc}</p>
                      </div>
                    </mdui-checkbox>
                  );
                })}
              </mdui-card>
            </section>
          );
        })}
      </div>
    </div>
  );
}
