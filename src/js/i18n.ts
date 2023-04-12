import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const languageDetector = new LanguageDetector(null, {
  order: ['htmlTag', 'cookie', 'localStorage', 'path', 'subdomain'],
  caches: ['cookie'],
});

const options: InitOptions = {
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translation', 'default_translation'],
  defaultNS: 'translation',

  supportedLngs: ['en', 'fr'],
  load: 'all',

  debug: false,
  backend: {
    loadPath: '/public/locales/{{lng}}/{{ns}}_{{lng}}.json',
  },

  react: {
    useSuspense: false,
  },
};

i18n.use(languageDetector).use(initReactI18next).use(HttpApi).init(options);

export default i18n;
