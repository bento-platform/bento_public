import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LNGS } from '@/constants/configConstants';
import { consumeKeepLanguageOnPop } from '@/utils/backNavigation';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);

const LanguageHandler = () => {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // After a scope header back button's history pop, restore the user's chosen language instead of the entry's.
    const current = i18n.language;
    if (
      lang &&
      lang !== current &&
      LNGS_ARRAY.includes(lang) &&
      LNGS_ARRAY.includes(current) &&
      consumeKeepLanguageOnPop()
    ) {
      const path = location.pathname.replace(new RegExp(`^/${lang}`), `/${current}`);
      navigate(path + location.search + location.hash, { replace: true, state: location.state });
      return;
    }

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
    // Only re-run when the URL's language changes:
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-x/exhaustive-deps
  }, [lang, i18n, navigate]);

  return <Outlet />;
};

export default LanguageHandler;
