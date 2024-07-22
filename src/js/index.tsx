// React and ReactDOM imports
import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

// Redux and routing imports
import { Provider } from 'react-redux';
import { Routes, Route, useParams, useNavigate, BrowserRouter } from 'react-router-dom';

// i18n and constants imports
import { useTranslation } from 'react-i18next';
import { NEW_BENTO_PUBLIC_THEME } from '@/constants/overviewConstants';
import { DEFAULT_TRANSLATION, SUPPORTED_LNGS } from '@/constants/configConstants';

// Component imports
import { Button, ConfigProvider, Layout, Modal, message } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SiteSider from '@/components/SiteSider';
import Loader from '@/components/Loader';
import BentoAppRouter from '@/components/BentoAppRouter';

// Hooks and utilities imports
import {
  useHandleCallback,
  checkIsInAuthPopup,
  useOpenSignInWindowCallback,
  usePopupOpenerAuthCallback,
  useSignInPopupTokenHandoff,
  useSessionWorkerTokenRefresh,
  BentoAuthContextProvider,
  nop,
} from 'bento-auth-js';
import { useQueryWithAuthIfAllowed } from '@/hooks';

// Store and configuration imports
import { store } from './store';
import { PUBLIC_URL_NO_TRAILING_SLASH, CLIENT_ID, OPENID_CONFIG_URL, AUTH_CALLBACK_URL } from './config';

// Styles imports
import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

const SIGN_IN_WINDOW_FEATURES = 'scrollbars=no, toolbar=no, menubar=no, width=800, height=600';
const CALLBACK_PATH = '/callback';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
const { Content } = Layout;

const createSessionWorker = () => new Worker(new URL('./workers/tokenRefresh.ts', import.meta.url));

const BentoApp = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // TRANSLATION
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation(DEFAULT_TRANSLATION);

  useEffect(() => {
    console.debug('lang', lang);
    if (lang && LNGS_ARRAY.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (i18n.language) {
      navigate(`/${i18n.language}/`, { replace: true });
    } else {
      navigate(`/${SUPPORTED_LNGS.ENGLISH}/`, { replace: true });
    }
  }, [lang, i18n.language, navigate]);

  return (
    <ConfigProvider theme={{ components: { Menu: { iconSize: 20 } } }}>
      <Layout style={{ minHeight: '100vh' }}>
        <SiteHeader />
        <Layout>
          <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout
            style={{
              marginLeft: collapsed ? '80px' : '200px',
              transition: 'margin-left 0.3s',
              marginTop: '64px',
            }}
          >
            <Content style={{ padding: '32px 64px' }}>
              <BentoAppRouter />
            </Content>
            <SiteFooter />
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const App = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);

  console.log('i18n.language', i18n.language);

  // AUTHENTICATION
  const [signedOutModal, setSignedOutModal] = useState(false);

  const sessionWorker = useRef(null);
  const signInWindow = useRef<Window | null>(null);
  const windowMessageHandler = useRef<((event: MessageEvent) => void) | null>(null);

  const openSignInWindow = useOpenSignInWindowCallback(signInWindow, SIGN_IN_WINDOW_FEATURES);

  const popupOpenerAuthCallback = usePopupOpenerAuthCallback();
  const isInAuthPopup = checkIsInAuthPopup(PUBLIC_URL_NO_TRAILING_SLASH);

  useHandleCallback(
    CALLBACK_PATH,
    () => {
      console.debug('authenticated');
    },
    isInAuthPopup ? popupOpenerAuthCallback : undefined,
    (msg) => message.error(msg)
  );

  // Set up message handling from sign-in popup
  useSignInPopupTokenHandoff(windowMessageHandler);

  useSessionWorkerTokenRefresh(sessionWorker, createSessionWorker, nop);

  useQueryWithAuthIfAllowed();

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH} theme={NEW_BENTO_PUBLIC_THEME}>
      <>
        <Modal
          title={t('You have been signed out')}
          onCancel={() => {
            setSignedOutModal(false);
          }}
          open={signedOutModal}
          footer={[
            <Button key="signin" shape="round" type="primary" onClick={openSignInWindow}>
              {t('Sign In')}
            </Button>,
          ]}
        >
          {t('Please sign in to the research portal.')}
          <br />
        </Modal>
        <Routes>
          <Route path="/callback" element={<Loader />} />
          <Route path="/:lang?/*" element={<BentoApp />} />
        </Routes>
      </>
    </ChartConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
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
        <App />
      </BentoAuthContextProvider>
    </BrowserRouter>
  </Provider>
);
