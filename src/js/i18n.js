import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import engTranslation from '../public/locales/en/translation.js';
import frTranslation from '../public/locales/fr/translation.js';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr'],
    debug: false,
    fallbackLng: 'en',
    direction: {
      order: ['htmlTag', 'cookie', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    resources: {
      en: {
        translation: engTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
