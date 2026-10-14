import React from 'react';
import ReactDOM from 'react-dom/client';
import 'mdui/mdui.css';
import 'mdui';
import '@fontsource/roboto/400.css';
import 'material-icons/iconfont/round.css';
import './style.css';
import UpdateApp from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UpdateApp />
  </React.StrictMode>
);
