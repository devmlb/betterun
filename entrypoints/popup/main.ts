import 'mdui/mdui.css';
import 'mdui';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import 'material-icons/iconfont/round.css';
import { setColorScheme } from 'mdui';

import type { Mod, Structure, ExtensionStorage } from '../../types/betterun';
import type { PublicPath } from 'wxt/browser';

function getModById(modId: string, modsList: Mod[]): Mod | null {
  for (const element of modsList) {
    if (element.id === modId) {
      return element;
    }
  }
  return null;
}

async function getMods(modsFile: PublicPath = '/mods.json'): Promise<Mod[]> {
  const response = await fetch(browser.runtime.getURL(modsFile));
  return response.json();
}

async function getStructure(structureFile: PublicPath = '/structure.json'): Promise<Structure> {
  const response = await fetch(browser.runtime.getURL(structureFile));
  return response.json();
}

async function getExtensionStorage(key: string | null = null): Promise<ExtensionStorage> {
  return (await browser.storage.sync.get(key)) as ExtensionStorage;
}

function createModsPagesLinks(structure: Structure): void {
  const modsPagesList = document.querySelector('#mods-list');
  if (!modsPagesList) return;

  structure.forEach((pageInfos) => {
    const modPageLink = document.createElement('mdui-card');
    modPageLink.innerHTML = `
      <p>${pageInfos.name}</p>
      <i class="material-icons-round">arrow_right</i>
    `;
    modPageLink.setAttribute('clickable', '');
    modPageLink.setAttribute('variant', 'filled');
    modPageLink.id = pageInfos.id + '-btn';
    modPageLink.classList.add('mod-link');
    modsPagesList.appendChild(modPageLink);

    modPageLink.addEventListener('click', () => {
      document.getElementById(pageInfos.id)?.classList.add('swipe-left');
      document.querySelector('#home-page')?.classList.add('swipe-left');
    });
  });
}

function createPages(structure: Structure): void {
  structure.forEach((pageInfos) => {
    let sections = '';
    Object.keys(pageInfos.sections).forEach((sectionId) => {
      sections += '<section>';
      sections += `<h3>${pageInfos.sections[sectionId]}</h3>`;
      sections += `<mdui-card variant="filled" id="${pageInfos.id}-${sectionId}" class="mods-card"></mdui-card>
      </section>`;
    });

    const page = document.createElement('div');
    page.id = pageInfos.id;
    page.classList.add('page');
    page.innerHTML = `
      <header>
        <mdui-button-icon class="back-btn" icon="arrow_back--rounded"></mdui-button-icon>
        <h2>${pageInfos.name}</h2>
        <div class="growing-space"></div>
      </header>
      <div class="content">
        ${sections}
      </div>
    `;
    document.body.appendChild(page);
  });

  document.querySelectorAll('.back-btn').forEach((backBtn) => {
    backBtn.addEventListener('click', () => {
      (backBtn.parentNode?.parentNode as HTMLElement)?.classList.remove('swipe-left');
      document.querySelector('#home-page')?.classList.remove('swipe-left');
    });
  });
}

async function enableDisableMod(modId: string, state: boolean): Promise<void> {
  const modSettings = (await getExtensionStorage(modId)) as Record<string, any>;
  if (modSettings[modId]) {
    modSettings[modId].enabled = state;
    console.info(`${state ? 'Enabling' : 'Disabling'} mod with id ${modId}`);
    await browser.storage.sync.set(modSettings);
  }
}

async function createMods(modsList: Mod[]): Promise<void> {
  const localSettings = await getExtensionStorage();
  const enableSwitch = document.querySelector('#enable-switch mdui-switch') as any;

  Object.keys(localSettings).forEach((key) => {
    if (!key.startsWith('gbs-')) {
      const mod = getModById(key.replace('mod-', ''), modsList);
      if (mod && !mod.hidden) {
        const modsCard = document.querySelector(`section>#${mod.pageId}-${mod.sectionId}`);
        if (!modsCard) return;

        const checkbox = document.createElement('mdui-checkbox') as any;
        checkbox.setAttribute('id', 'mod-' + mod.id);
        checkbox.setAttribute('class', 'mod-checkbox');
        checkbox.innerHTML = `<div class="checkbox-div">
            <p class="checkbox-title">${mod.title}<mdui-badge variant="large">${mod.version}</mdui-badge></p>
            <p class="checkbox-desc">${mod.desc}</p>
        </div>`;

        if (localSettings[key]?.enabled) {
          checkbox.setAttribute('checked', '');
        }
        if (enableSwitch && !enableSwitch.checked) {
          checkbox.setAttribute('disabled', '');
        }

        modsCard.appendChild(checkbox);
        checkbox.addEventListener('change', () => {
          enableDisableMod(checkbox.getAttribute('id'), checkbox.checked);
        });
      }
    }
  });
}

async function initUI(): Promise<void> {
  const structure = await getStructure();
  const mods = await getMods();
  const localSettings = await getExtensionStorage();
  const enableSwitch = document.querySelector('#enable-switch mdui-switch') as any;

  if (localSettings['gbs-enabled'] && enableSwitch) {
    enableSwitch.setAttribute('checked', '');
  }

  enableSwitch?.addEventListener('change', () => {
    const modsCards = document.querySelectorAll('.mod-checkbox');
    let enableSwitchState = true;
    if (enableSwitch.checked) {
      modsCards.forEach((mod) => {
        mod.removeAttribute('disabled');
      });
      console.info('Enabling the extension');
    } else {
      enableSwitchState = false;
      modsCards.forEach((mod) => {
        mod.setAttribute('disabled', '');
      });
      console.info('Disabling the extension');
    }
    browser.storage.sync.set({ 'gbs-enabled': enableSwitchState });
  });

  const enableSwitchCard = document.querySelector('#enable-switch');
  enableSwitchCard?.addEventListener('click', () => {
    enableSwitch?.click();
  });

  const settingsPage = document.querySelector('#settings-page');
  document.querySelector('#settings-btn')?.addEventListener('click', () => {
    settingsPage?.classList.add('swipe-left');
    document.querySelector('#home-page')?.classList.add('swipe-left');
  });

  const releaseVersionEl = document.querySelector('#release-version');
  if (releaseVersionEl) {
    releaseVersionEl.textContent = 'v' + browser.runtime.getManifest().version;
  }

  createPages(structure);
  createModsPagesLinks(structure);
  await createMods(mods);
}

document.addEventListener('DOMContentLoaded', () => {
  setColorScheme('#3452ff');
  initUI();
  setTimeout(() => {
    document.body.classList.add('ready');
  }, 160);
});
