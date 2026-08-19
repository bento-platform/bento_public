import type { Metadata } from 'next';
import Script from 'next/script';

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
          // Define an empty global as a fallback for what ends up in the BENTO_PUBLIC_CONFIG global;
          // left mutable so /public/config.js (see src/app/public/config.js/route.ts) can override it.
          dangerouslySetInnerHTML={{ __html: 'let BENTO_PUBLIC_CONFIG = {};' }}
        />
        <Script src="/public/config.js" strategy="beforeInteractive" />
        {/*
          Overridable instance CSS file for instances to specify their own custom styles, e.g., web
          fonts loaded into the assets folder, or style overrides that aren't handled by environment
          variables. Not a build-time import since it's meant to be swapped in per-deployment.
        */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/public/styles/instance.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
