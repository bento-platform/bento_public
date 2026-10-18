import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

/** Keeps i18next and <html lang> in sync with the [lang] route segment; proxy.ts guarantees it's supported. */
const LanguageHandler = ({ children }: { children: ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return <>{children}</>;
};

export default LanguageHandler;
