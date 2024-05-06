import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useParams, useNavigate, BrowserRouter } from 'react-router-dom';
import { Button, Layout, Modal, message } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import { DEFAULT_TRANSLATION, SUPPORTED_LNGS } from './constants/configConstants';

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

import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import SiteSider from '@/components/SiteSider';
import SitePageLoading from './components/SitePageLoading';

import { store } from './store';

import { useBeaconWithAuthIfAllowed } from '@/hooks';
import { PUBLIC_URL_NO_TRAILING_SLASH, CLIENT_ID, OPENID_CONFIG_URL, AUTH_CALLBACK_URL } from './config';

const SIGN_IN_WINDOW_FEATURES = 'scrollbars=no, toolbar=no, menubar=no, width=800, height=600';
const CALLBACK_PATH = '/callback';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
const { Content } = Layout;

const createSessionWorker = () => new Worker(new URL('./workers/tokenRefresh.ts', import.meta.url));

const App = () => {
  const navigate = useNavigate();

  // TRANSLATION
  const { lang } = useParams<{ lang?: string }>();
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);

  useEffect(() => {
    console.debug('lang', lang);
    if (lang && lang == 'callback') return;
    if (lang && LNGS_ARRAY.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (i18n.language) {
      navigate(`/${i18n.language}/`, { replace: true });
    } else {
      navigate(`/${SUPPORTED_LNGS.ENGLISH}/`, { replace: true });
    }
  }, [lang, i18n.language, navigate]);

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

  useBeaconWithAuthIfAllowed();

  return (
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
      <Layout style={{ minHeight: '100vh' }}>
        <SiteSider />
        <Layout>
          <SiteHeader />
          <Content style={{ padding: '0 30px', marginTop: '10px' }}>
            <Suspense fallback={<SitePageLoading />}>
              <Routes>
                <Route path={CALLBACK_PATH} element={<SitePageLoading />} />
                <Route path="/:page?/*" element={<TabbedDashboard />} />
              </Routes>
            </Suspense>
          </Content>
          <SiteFooter />
        </Layout>
      </Layout>
    </>
  );
};

const BentoApp = () => {
  const { i18n } = useTranslation();
  console.log('i18n.language', i18n.language);

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH}>
      <Routes>
        <Route path="/:lang?/*" element={<App />} />
      </Routes>
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
        <BentoApp />
      </BentoAuthContextProvider>
    </BrowserRouter>
  </Provider>
);
