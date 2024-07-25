// React and ReactDOM imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Redux and routing imports
import { Provider } from 'react-redux';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// i18n and constants imports
import { useTranslation } from 'react-i18next';
import { NEW_BENTO_PUBLIC_THEME } from '@/constants/overviewConstants';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

// Component imports
import { ConfigProvider } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import Loader from '@/components/Loader';
import BentoAppRouter from '@/components/BentoAppRouter';
import LanguageHandler from '@/components/Util/LanguageHandler';
import AuthOutlet from '@/components/Util/AuthOutlet';

// Hooks and utilities imports
import { BentoAuthContextProvider } from 'bento-auth-js';

// Store and configuration imports
import { store } from './store';
import { PUBLIC_URL_NO_TRAILING_SLASH, CLIENT_ID, OPENID_CONFIG_URL, AUTH_CALLBACK_URL } from './config';

// Styles imports
import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

const BaseRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthOutlet />}>
        <Route path="/callback" element={<Loader />} />
        <Route element={<LanguageHandler />}>
          <Route path="/:lang/*" element={<BentoAppRouter />} />
        </Route>
      </Route>
    </Routes>
  );
};

const RootApp: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <BentoAuthContextProvider
          value={{
            applicationUrl: PUBLIC_URL_NO_TRAILING_SLASH,
            openIdConfigUrl: OPENID_CONFIG_URL,
            clientId: CLIENT_ID,
            scope: 'openid email',
            postSignOutUrl: `${PUBLIC_URL_NO_TRAILING_SLASH}/`,
            authCallbackUrl: AUTH_CALLBACK_URL,
          }}
        >
          <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH} theme={NEW_BENTO_PUBLIC_THEME}>
            <ConfigProvider theme={{ components: { Menu: { iconSize: 20 } } }}>
              <BaseRoutes />
            </ConfigProvider>
          </ChartConfigProvider>
        </BentoAuthContextProvider>
      </BrowserRouter>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RootApp />);
