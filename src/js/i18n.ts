import type { InitOptions } from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { SUPPORTED_LNGS } from './constants/configConstants';

const languageDetector = new LanguageDetector(null, {
  order: ['htmlTag', 'cookie', 'localStorage', 'path', 'subdomain'],
  caches: ['cookie'],
});

const options: InitOptions = {
  fallbackLng: SUPPORTED_LNGS.ENGLISH,

  // have a common namespace used around the full app
  ns: ['translation', 'default_translation'],
  defaultNS: 'translation',
  fallbackNS: 'default_translation',

  supportedLngs: Object.values(SUPPORTED_LNGS),
  load: 'all',
  preload: [SUPPORTED_LNGS.ENGLISH, SUPPORTED_LNGS.FRENCH],

  debug: false,
  backend: {
    loadPath: '/public/locales/{{lng}}/{{ns}}_{{lng}}.json',
  },

  react: {
    useSuspense: true,
  },
};

i18n.use(languageDetector).use(initReactI18next).use(HttpApi).init(options);

export default i18n;
