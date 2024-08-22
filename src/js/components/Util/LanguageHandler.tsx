import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, SUPPORTED_LNGS } from '@/constants/configConstants';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);

const LanguageHandler = () => {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation(DEFAULT_TRANSLATION);

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

  return <Outlet />;
};

export default LanguageHandler;
