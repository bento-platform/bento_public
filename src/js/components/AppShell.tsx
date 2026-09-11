'use client';

import { useEffect, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

import { useT } from 'next-i18next/client';
import { NEW_BENTO_PUBLIC_THEME } from '@/constants/exploreConstants';
import { SESSION_REFETCH_INTERVAL_SECONDS, SUPPORTED_LNGS } from '@/constants/configConstants';

import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import frCA from 'antd/locale/fr_CA';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ca';
import { ChartConfigProvider } from 'bento-charts';
import AppEffects from '@/components/AppEffects';
import AuthGuard from '@/components/Util/AuthGuard';
import DefaultLayout from '@/components/Util/DefaultLayout';
import ResponsiveProvider from '@/components/Util/ResponsiveProvider';

import { NotificationProvider } from '@/hooks/notifications';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useHandleRefreshTokenError } from '@/features/auth/hooks';

import { store } from '@/store';
import { PCGL_MODE } from '@/config';

/** Inner root app component with responsive context for screen-size-aware theming and more hook access */
const InnerAppShell = ({ children }: { children: ReactNode }) => {
  const { i18n } = useT();
  const { lang } = useParams<{ lang: string }>();
  const antdLocale = i18n.language === SUPPORTED_LNGS.FRENCH ? frCA : enUS;
  const isSmallScreen = useSmallScreen();

  useHandleRefreshTokenError();

  // next-i18next's I18nProvider (in app/[lang]/layout.tsx) already reacts to its own `language` prop
  // changing, but that depends on the [lang] layout segment actually re-rendering on a client-side
  // transition - not something this app should have to rely on getting right. Driving the switch directly
  // from the URL's own [lang] param here is a more direct, always-correct source of truth: every client
  // route change updates this param, so this effect (and the instance's own resources, all fully preloaded -
  // see i18n.config.ts) is all that's needed for SiteHeader's changeLanguage() soft-navigation to actually
  // update the active language.
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // The <html lang> attribute is set server-side (from a request header) in the root layout, which is above
  // the [lang] segment and isn't guaranteed to re-render on a client-side language switch. Keep it in sync
  // from here instead, which - unlike that server render - reacts to every subsequent language change too.
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
          <AuthGuard>
            <AppEffects>
              <DefaultLayout>{children}</DefaultLayout>
            </AppEffects>
          </AuthGuard>
        </NotificationProvider>
      </ConfigProvider>
    </ChartConfigProvider>
  );
};

/** Providers/chrome shared by every route under the [lang] segment. Rendered from app/[lang]/layout.tsx. */
const AppShell = ({ children }: { children: ReactNode }) => (
  <SessionProvider refetchInterval={SESSION_REFETCH_INTERVAL_SECONDS}>
    <Provider store={store}>
      <ResponsiveProvider>
        <InnerAppShell>{children}</InnerAppShell>
      </ResponsiveProvider>
    </Provider>
  </SessionProvider>
);

export default AppShell;
