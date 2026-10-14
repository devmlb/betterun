document.addEventListener('DOMContentLoaded', () => {
  (window as any).mdui?.setColorScheme('#3452ff');

  const headerTitle = document.querySelector('#header-title');
  if (headerTitle) {
    headerTitle.textContent = `BetterUN a été mise à jour vers la version ${browser.runtime.getManifest().version} !`;
  }
});
