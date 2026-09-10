import { initServerI18next, getT, getResources, generateI18nStaticParams } from 'next-i18next/server'
import { I18nProvider } from 'next-i18next/client'
import i18nConfig from '../../i18n.config'

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
    <html lang={lang}>
      <body>
        <I18nProvider language={lang} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}