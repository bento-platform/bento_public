import type { InitOptions } from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { PCGL_MODE, TRANSLATED } from '@/config';
import { SUPPORTED_LNGS, SUPPORTED_LNGS_ARRAY } from './constants/languages';

const options: InitOptions = {
  // The URL decides the language: start with the [lang] segment (proxy.ts guarantees one), and LanguageHandler keeps
  // i18next in sync on navigation.
  lng: SUPPORTED_LNGS_ARRAY.find((l) => l === window.location.pathname.split('/')[1]) ?? SUPPORTED_LNGS.ENGLISH,
  fallbackLng: SUPPORTED_LNGS.ENGLISH,

  // have a common namespace used around the full app
  ns: ['translation', ...(PCGL_MODE ? ['pcgl_translation'] : []), 'default_translation'],
  defaultNS: 'translation',
  fallbackNS: PCGL_MODE ? ['pcgl_translation', 'default_translation'] : 'default_translation',

  supportedLngs: TRANSLATED ? Object.values(SUPPORTED_LNGS) : ['en'],
  load: 'all',
  preload: [SUPPORTED_LNGS.ENGLISH, SUPPORTED_LNGS.FRENCH],

  debug: false,
  backend: {
    loadPath: '/public/locales/{{lng}}/{{ns}}_{{lng}}.json',
  },

  interpolation: {
    // See https://www.i18next.com/translation-function/nesting#passing-nesting-to-interpolated)
    skipOnVariables: false,
  },

  react: {
    useSuspense: true,
  },
};

i18n.use(initReactI18next).use(HttpApi).init(options);

// Add lower-case formatter, originally for rendering entity names ("Individual") as lowercase in some situations.
i18n.services.formatter?.add('lowercase', (value, _lng, _options) => value.toLocaleLowerCase());

export default i18n;
