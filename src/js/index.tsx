import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import { SUPPORTED_LNGS } from './constants/configConstants';

import {
  fetchOpenIdConfiguration,
  createAuthURL,
  useHandleCallback,
  getIsAuthenticated,
  // refreshTokens,
  tokenHandoff,
  LS_SIGN_IN_POPUP,
  refreshTokens,
} from 'bento-auth-js';
import { AUTH_CALLBACK_URL, BENTO_URL_NO_TRAILING_SLASH, CLIENT_ID, OPENID_CONFIG_URL } from './config';

import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

import { store } from './store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { beaconOnAuth } from '@/utils/beaconOnAuth';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
const { Content } = Layout;

const App = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const sessionExpiry = useAppSelector((state) => state.auth.sessionExpiry);
  useEffect(() => {
    if (sessionExpiry) {
      const timeout = setTimeout(
        () => {
          setShouldRefresh(true);
        },
        sessionExpiry - Date.now() - 10000
      );
      return () => clearTimeout(timeout);
    }
  }, [sessionExpiry]);

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
    dispatch(fetchOpenIdConfiguration(OPENID_CONFIG_URL));
  }, [dispatch]);

  const openIdConfig = useAppSelector((state) => state.openIdConfiguration.data);

  // Opens sign-in window
  const userSignIn = useCallback(() => {
    // If we already have a sign-in window open, focus on it instead.
    if (signInWindow.current && !signInWindow.current.closed) {
      signInWindow.current.focus();
      return;
    }

    if (!openIdConfig) return;

    (async () => {
      // open a window with this url to sign in
      localStorage.setItem(LS_SIGN_IN_POPUP, 'true');
      const authUrl = await createAuthURL(openIdConfig['authorization_endpoint'], CLIENT_ID, AUTH_CALLBACK_URL);
      signInWindow.current = window.open(authUrl, 'Bento Sign In');
    })();
  }, [signInWindow, openIdConfig]);

  const isInAuthPopup = () => {
    try {
      const didCreateSignInPopup = localStorage.getItem(LS_SIGN_IN_POPUP);
      return window.opener && window.opener.origin === BENTO_URL_NO_TRAILING_SLASH && didCreateSignInPopup === 'true';
    } catch {
      // If we are restricted from accessing the opener, we are not in an auth popup.
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popupOpenerAuthCallback = async (_dispatch: any, _navigate: any, code: string, verifier: string) => {
    if (!window.opener) return;

    // We're inside a popup window for authentication

    // Send the code and verifier to the main thread/page for authentication
    // IMPORTANT SECURITY: provide BENTO_URL as the target origin:
    window.opener.postMessage({ type: 'authResult', code, verifier }, BENTO_URL_NO_TRAILING_SLASH);

    // We're inside a popup window which has successfully re-authenticated the user, meaning we need to
    // close ourselves to return focus to the original window.
    window.close();
  };

  // Auth code callback handling
  useHandleCallback(
    '/callback',
    () => {
      beaconOnAuth();
      console.log('authenticated');
    }, // TODO:: make authenticated beacon call
    CLIENT_ID,
    AUTH_CALLBACK_URL,
    isInAuthPopup() ? popupOpenerAuthCallback : undefined
  );

  useEffect(() => {
    if (shouldRefresh) {
      dispatch(refreshTokens(CLIENT_ID));
      setShouldRefresh(false);
    }
  }, [dispatch, shouldRefresh]);

  // Token handoff with Proof Key for Code Exchange (PKCE) from the sing-in window
  useEffect(() => {
    if (windowMessageHandler.current) {
      window.removeEventListener('message', windowMessageHandler.current);
    }
    windowMessageHandler.current = (e) => {
      if (e.data?.type !== 'authResult') return;
      const { code, verifier } = e.data ?? {};
      if (!code || !verifier) return;
      localStorage.removeItem(LS_SIGN_IN_POPUP);
      dispatch(tokenHandoff({ code, verifier, clientId: CLIENT_ID, authCallbackUrl: AUTH_CALLBACK_URL }));
    };
    window.addEventListener('message', windowMessageHandler.current);
  }, [dispatch, windowMessageHandler]);

  const { accessToken, idTokenContents } = useAppSelector((state) => state.auth);
  // Get user auth status
  useEffect(() => {
    const isAuthenticated = getIsAuthenticated(idTokenContents);
    console.log('isAuthenticated', isAuthenticated);
    console.log('accessToken', accessToken);
    console.log('url', window.location);
  }, [window.location]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiteHeader signIn={userSignIn} />
      <Content style={{ padding: '0 30px', marginTop: '10px' }}>
        <Routes>
          <Route path="/:page?/*" element={<TabbedDashboard />} />
        </Routes>
      </Content>
      <SiteFooter />
    </Layout>
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
      <BentoApp />
    </HashRouter>
  </Provider>
);
