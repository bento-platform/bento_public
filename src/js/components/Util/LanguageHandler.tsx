import { type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LNGS } from '@/constants/configConstants';
import { useNavigate, useRouteMatch } from '@/hooks/router';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);

const LanguageHandler = ({ children }: { children: ReactNode }) => {
  const { lang } = useRouteMatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const setLanguage = (newLang: string) => {
      i18n.changeLanguage(newLang);
      if (lang !== newLang) {
        navigate(`/${newLang}/`, { replace: true });
      }
    };

    if (lang && LNGS_ARRAY.includes(lang)) {
      setLanguage(lang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = LNGS_ARRAY.includes(browserLang) ? browserLang : SUPPORTED_LNGS.ENGLISH;
      setLanguage(defaultLang);
    }
  }, [lang, i18n, navigate]);

  // Until the URL carries a supported language, we're redirecting; don't render the app under a bogus language.
  return lang && LNGS_ARRAY.includes(lang) ? <>{children}</> : null;
};

export default LanguageHandler;
