import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProfileProvider } from './modules/ProfileProvider';
import './styles/global.css';
import ReactModal from 'react-modal';

ReactDOM.render(
  <React.StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

ReactModal.setAppElement("#root")

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
