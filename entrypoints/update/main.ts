import 'mdui/mdui.css';
import 'mdui';
import '@fontsource/roboto/400.css';
import 'material-icons/iconfont/round.css';
import { setColorScheme } from 'mdui';

document.addEventListener('DOMContentLoaded', () => {
  setColorScheme('#3452ff');

  const headerTitle = document.querySelector('#header-title');
  if (headerTitle) {
    headerTitle.textContent = `BetterUN a été mise à jour vers la version ${browser.runtime.getManifest().version} !`;
  }
});
