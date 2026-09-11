import { initServerI18next, getT, getResources, generateI18nStaticParams } from 'next-i18next/server'
import { I18nProvider } from 'next-i18next/client'
import i18nConfig from '../../i18n.config'
import AppShell from '@/components/AppShellClientOnly'

// Styles imports
import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import 'react18-json-view/src/style.css';
import 'bento-charts/src/styles.css';
import 'bento-file-display/dist/style.css';
import '../../styles.css';

initServerI18next(i18nConfig)

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
    <I18nProvider
      language={lang}
      resources={resources}
      defaultNS={i18nConfig.defaultNS}
      fallbackLng={i18nConfig.fallbackLng}
      supportedLngs={i18nConfig.supportedLngs}
      i18nextOptions={i18nConfig.i18nextOptions}
    >
      <AppShell>{children}</AppShell>
    </I18nProvider>
  )
}
