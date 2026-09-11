import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';
import i18nConfig from '../i18n.config';

export const metadata: Metadata = {
  title: 'Bento',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const lang = (await headers()).get('x-i18next-current-language') ?? i18nConfig.fallbackLng;

  return (
    <html lang={lang}>
      <head>
        {/* Overridable instance CSS file for custom styling */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/public/styles/instance.css" />
      </head>
      <body>
        <Script
          id="bento-public-config-fallback"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: 'let BENTO_PUBLIC_CONFIG = {};' }}
        />
        <Script src="/public/config.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
