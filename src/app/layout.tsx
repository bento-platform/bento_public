import type { Metadata } from 'next';
import Script from 'next/script';

import ClientApp from './ClientApp';

export const metadata: Metadata = {
  title: 'Bento',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="bento-public-config-fallback"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: 'let BENTO_PUBLIC_CONFIG = {};' }}
        />
        <Script src="/public/config.js" strategy="beforeInteractive" />
        {/* Overridable instance CSS file for custom styling */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/public/styles/instance.css" />
      </head>
      <body>
        {/* Rendered here rather than in the [[...slug]] page: layouts don't remount on navigation, pages do. */}
        <ClientApp />
        {children}
      </body>
    </html>
  );
}
