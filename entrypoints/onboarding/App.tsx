import React, { useEffect, useRef, useState } from 'react';
import { setColorScheme } from 'mdui';

export default function OnboardingApp() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setColorScheme('#3452ff');
  }, []);

  useEffect(() => {
    const snackbar = snackbarRef.current;
    if (!snackbar) return;

    const handleClosed = () => setSnackbarOpen(false);
    snackbar.addEventListener('closed', handleClosed);
    return () => snackbar.removeEventListener('closed', handleClosed);
  }, []);

  const handleRequestPermission = async () => {
    try {
      await browser.permissions.request({ origins: ['https://*.univ-nantes.fr/*'] });
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to request permissions:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/icons/icon-256.png"
          style={{ width: '50px', height: '50px', marginRight: '10px' }}
          alt="BetterUN logo"
        />
        <h1>BetterUN</h1>
      </div>
      <mdui-card variant="filled" style={{ padding: '60px', textAlign: 'center', maxWidth: '40vw' }}>
        <h1 style={{ marginTop: '0px', marginBottom: '30px' }}>Vous y êtes presque !</h1>
        <p style={{ marginTop: '0px', marginBottom: '60px', fontSize: '18px' }}>
          Il ne vous reste plus qu'à accorder à l'extension l'autorisation d'accéder
          aux URLs du type "https://*.univ-nantes.fr" pour qu'elle puisse fonctionner correctement.
        </p>
        <mdui-button
          id="permission-btn"
          style={{ marginTop: '5px' }}
          full-width
          end-icon="open_in_new--rounded"
          onClick={handleRequestPermission}
        >
          Accorder les permissions nécessaires
        </mdui-button>
        <p style={{ marginTop: '20px' }}>Un popup devrait s'ouvrir. Une fois terminé, vous pourrez fermer cette page.</p>
      </mdui-card>
      <mdui-snackbar ref={snackbarRef} open={snackbarOpen || undefined}>
        Demande de permissions initiée.
      </mdui-snackbar>
    </div>
  );
}
