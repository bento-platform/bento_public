'use client';

// React imports
import { useEffect } from 'react';

// Redux and routing imports
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SessionProvider } from 'next-auth/react';

// i18n and constants imports
import { useTranslation } from 'react-i18next';
import { NEW_BENTO_PUBLIC_THEME } from '@/constants/exploreConstants';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

// Component imports
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import frCA from 'antd/locale/fr_CA';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ca';
import { ChartConfigProvider } from 'bento-charts';
import BentoAppRouter from '@/components/BentoAppRouter';
import LanguageHandler from '@/components/Util/LanguageHandler';
import AuthOutlet from '@/components/Util/AuthOutlet';
import ResponsiveProvider from '@/components/Util/ResponsiveProvider';

// Hooks and utilities imports
import { NotificationProvider } from '@/hooks/notifications';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

// Store and configuration imports
import { store } from './store';
import { PCGL_MODE } from './config';

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

  // antd's ConfigProvider locale only translates UI text (buttons, placeholders); the DatePicker's
  // month/day names come from dayjs's own locale, which must be set separately or it stays English.
  useEffect(() => {
    dayjs.locale(i18n.language === SUPPORTED_LNGS.FRENCH ? 'fr-ca' : 'en');
  }, [i18n.language]);

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
  // refetchInterval matches bento-auth-js's old token-refresh-worker cadence; refetchOnWindowFocus (on by default)
  // covers the case where that interval was throttled while the tab was in the background.
  <SessionProvider refetchInterval={120}>
    <Provider store={store}>
      <BrowserRouter>
        <ResponsiveProvider>
          <InnerRootApp />
        </ResponsiveProvider>
      </BrowserRouter>
    </Provider>
  </SessionProvider>
);

export default RootApp;
