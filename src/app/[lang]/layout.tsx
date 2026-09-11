import type { Metadata } from 'next'
import Script from 'next/script'
import { initServerI18next, getT, getResources, generateI18nStaticParams } from 'next-i18next/server'
import { I18nProvider } from 'next-i18next/client'
import i18nConfig from '../../i18n.config'

initServerI18next(i18nConfig)

export const metadata: Metadata = {
  title: 'Bento',
}

export async function generateStaticParams() {
  return generateI18nStaticParams()
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const { i18n } = await getT()
  const resources = getResources(i18n)

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
        <I18nProvider
          language={lang}
          resources={resources}
          defaultNS={i18nConfig.defaultNS}
          fallbackLng={i18nConfig.fallbackLng}
          supportedLngs={i18nConfig.supportedLngs}
          i18nextOptions={i18nConfig.i18nextOptions}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
