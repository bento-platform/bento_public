import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Layout, Modal, message } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import { SUPPORTED_LNGS } from './constants/configConstants';

import {
  fetchOpenIdConfiguration,
  useHandleCallback,
  getIsAuthenticated,
  checkIsInAuthPopup,
  useOpenSignInWindowCallback,
  usePopupOpenerAuthCallback,
  useSignInPopupTokenHandoff,
  useSessionWorkerTokenRefresh,
  BentoAuthContextProvider,
} from 'bento-auth-js';

import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import SitePageLoading from './components/SitePageLoading';

import { store } from './store';
import { useAppDispatch, useAppSelector, useBeaconWithAuthIfAllowed } from '@/hooks';

import {
  BENTO_URL_NO_TRAILING_SLASH,
  CLIENT_ID,
  OPENID_CONFIG_URL,
  AUTH_CALLBACK_URL,
} from "./config";

const SIGN_IN_WINDOW_FEATURES = "scrollbars=no, toolbar=no, menubar=no, width=800, height=600";
const CALLBACK_PATH = "/callback";

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
const { Content } = Layout;

const createSessionWorker = () => new Worker(new URL("./workers/tokenRefresh.ts", import.meta.url));

const App = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [signedOutModal, setSignedOutModal] = useState(false);
  
  const sessionWorker = useRef(null);

  useEffect(() => {
    console.log('lang', lang);
    if (lang && lang == 'callback') return;
    if (lang && LNGS_ARRAY.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (i18n.language) {
      navigate(`/${i18n.language}/`);
    } else {
      navigate(`/${SUPPORTED_LNGS.ENGLISH}/`);
    }
  }, [lang, i18n.language, navigate]);

  const dispatch = useAppDispatch();

  // Popup sign-in window and its message handler refs
  const signInWindow = useRef<Window | null>(null);
  const windowMessageHandler = useRef<((event: MessageEvent) => void) | null>(null);

  // Get the OIDC config
  useEffect(() => {
    if (OPENID_CONFIG_URL) {
      dispatch(fetchOpenIdConfiguration(OPENID_CONFIG_URL));
    }
  }, [dispatch, OPENID_CONFIG_URL]);

  // Auth popup hooks/callbacks
  const isInAuthPopup = checkIsInAuthPopup(BENTO_URL_NO_TRAILING_SLASH);

  const popupOpenerAuthCallback = usePopupOpenerAuthCallback();

  useHandleCallback(
    CALLBACK_PATH,
    () => {
      console.debug("authenticated");
    },
    isInAuthPopup ? popupOpenerAuthCallback : undefined,
    (msg) => message.error(msg)
  );

  // Set up message handling from sign-in popup
  useSignInPopupTokenHandoff(windowMessageHandler);

  const openSignInWindow = useOpenSignInWindowCallback(signInWindow, SIGN_IN_WINDOW_FEATURES);

  const { accessToken, idTokenContents } = useAppSelector((state) => state.auth); 
  const isAuthenticated = getIsAuthenticated(idTokenContents);

  // Get user auth status
  useEffect(() => {
    // const isAuthenticated = getIsAuthenticated(idTokenContents);
    console.log('isAuthenticated', isAuthenticated);
    console.log('accessToken', accessToken);
    console.log('url', window.location);
  }, [window.location]);

  const onAuthSuccess = () => {
    console.log("Authenticated.");
  };
  useSessionWorkerTokenRefresh(
    sessionWorker,
    createSessionWorker,
    onAuthSuccess
  );

  useBeaconWithAuthIfAllowed();

  return (
    <>
      <Modal
        // TODO: translate
        title={"You have been signed out"}
        footer={null}
        onCancel={() => {
          setSignedOutModal(false);
        }}
        open={signedOutModal}
      >
        Please <a onClick={openSignInWindow}>sign in</a> to the research portal.
      </Modal>
      <Layout style={{ minHeight: '100vh' }}>
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
    <HashRouter>
      <BentoAuthContextProvider value={{
        applicationUrl: BENTO_URL_NO_TRAILING_SLASH,
        openIdConfigUrl: OPENID_CONFIG_URL,
        clientId: CLIENT_ID,
        scope: "openid email",
        postSignOutUrl: `${BENTO_URL_NO_TRAILING_SLASH}/`,
        authCallbackUrl: AUTH_CALLBACK_URL,
      }}>
        <BentoApp />
      </BentoAuthContextProvider>
    </HashRouter>
  </Provider>
);
