import React, { useEffect, useState } from 'react';
import { setColorScheme } from 'mdui';
import bannerSvg from './banner.svg';

export default function UpdateApp() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    setColorScheme('#3452ff');
    setVersion(browser.runtime.getManifest().version);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/icons/icon-256.png" style={{ width: '50px', height: '50px', marginRight: '10px' }} alt="BetterUN logo" />
        <h1>BetterUN</h1>
      </div>
      <mdui-card variant="filled" style={{ padding: '60px', textAlign: 'center', maxWidth: '40vw' }}>
        <h1 id="header-title" style={{ marginTop: '0px', marginBottom: '60px' }}>
          {version ? `BetterUN a été mise à jour vers la version ${version} !` : 'BetterUN a été mise à jour !'}
        </h1>
        <img src={bannerSvg} style={{ height: '30vh', marginBottom: '30px' }} alt="BetterUN update banner" />
        <mdui-button href="https://github.com/devmlb/betterun/releases/latest" style={{ marginTop: '5px' }}>
          Consulter la liste des améliorations
        </mdui-button>
      </mdui-card>
    </div>
  );
}
