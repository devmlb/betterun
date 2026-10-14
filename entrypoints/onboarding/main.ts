document.addEventListener('DOMContentLoaded', () => {
  (window as any).mdui?.setColorScheme('#3452ff');
  const btn = document.getElementById('permission-btn');
  const snackbar = document.getElementById('snackbar') as any;

  btn?.addEventListener('click', async () => {
    try {
      await browser.permissions.request({ origins: ['https://*.univ-nantes.fr/*'] });
      if (snackbar) {
        snackbar.open = true;
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
    }
  });
});
