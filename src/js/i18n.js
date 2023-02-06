import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translation', 'default_translation'],
    defaultNS: 'translation',

    supportedLngs: ['en', 'fr'],
    load: 'all',

    debug: true,
    backend: {
      loadPath: '/public/locales/{{lng}}/{{ns}}_{{lng}}.json',
    },

    direction: {
      order: ['htmlTag', 'cookie', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
