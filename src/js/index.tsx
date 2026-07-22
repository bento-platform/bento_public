// React and ReactDOM imports
import ReactDOM from 'react-dom/client';

// Redux and routing imports
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// i18n and constants imports
import { useTranslation } from 'react-i18next';
import { NEW_BENTO_PUBLIC_THEME } from '@/constants/overviewConstants';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

// Component imports
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import frCA from 'antd/locale/fr_CA';
import { ChartConfigProvider } from 'bento-charts';
import Loader from '@/components/Loader';
import BentoAppRouter from '@/components/BentoAppRouter';
import LanguageHandler from '@/components/Util/LanguageHandler';
import AuthOutlet from '@/components/Util/AuthOutlet';
import ResponsiveProvider from '@/components/Util/ResponsiveProvider';

// Hooks and utilities imports
import { BentoAuthContextProvider } from 'bento-auth-js';
import { NotificationProvider } from '@/hooks/notifications';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

// Store and configuration imports
import { store } from './store';
import { AUTH_CALLBACK_URL, CLIENT_ID, OPENID_CONFIG_URL, PCGL_MODE, PUBLIC_URL_NO_TRAILING_SLASH } from './config';

// Styles imports
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import 'react18-json-view/src/style.css';
import 'bento-charts/src/styles.css';
import 'bento-file-display/dist/style.css';
import './i18n';
import '../styles.css';

const BaseRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthOutlet />}>
        <Route path="/callback" element={<Loader fullHeight={true} />} />
        <Route element={<LanguageHandler />}>
          <Route path="/:lang/*" element={<BentoAppRouter />} />
          <Route path="*" element={<Navigate to="/en/" />} />
        </Route>
      </Route>
    </Routes>
  );
};

/** Inner root app component with responsive context for screen-size-aware theming and more hook access */
const InnerRootApp = () => {
  const { i18n } = useTranslation();
  const antdLocale = i18n.language === SUPPORTED_LNGS.FRENCH ? frCA : enUS;
  const isSmallScreen = useSmallScreen();

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH} theme={NEW_BENTO_PUBLIC_THEME}>
      <ConfigProvider
        locale={antdLocale}
        theme={{
          cssVar: { key: 'bento-theme' },
          components: {
            Button: { algorithm: !PCGL_MODE },
            Card: { bodyPadding: isSmallScreen ? 10 : 24 },
            Menu: { iconSize: 20 },
            Table: { borderColor: 'rgba(0, 0, 0, 0.08)' },
          },
          token: PCGL_MODE ? { colorPrimary: '#2B7AAD' } : {},
        }}
      >
        <NotificationProvider>
          <BaseRoutes />
        </NotificationProvider>
      </ConfigProvider>
    </ChartConfigProvider>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ResponsiveProvider>
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
          <InnerRootApp />
        </BentoAuthContextProvider>
      </ResponsiveProvider>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RootApp />);
