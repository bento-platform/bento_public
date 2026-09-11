import type { I18nConfig } from 'next-i18next/proxy';
import { PCGL_MODE, TRANSLATED } from '@/config';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

const i18nConfig: I18nConfig = {
  supportedLngs: TRANSLATED ? Object.values(SUPPORTED_LNGS) : ['en'],
  fallbackLng: SUPPORTED_LNGS.ENGLISH,
  defaultNS: 'default_translation',
  ns: ['translation', ...(PCGL_MODE ? ['pcgl_translation'] : []), 'default_translation'],
  reloadOnPrerender: true,

  i18nextOptions: {
    fallbackNS: PCGL_MODE ? ['pcgl_translation', 'default_translation'] : 'default_translation',
    interpolation: {
      skipOnVariables: false,
    },
    load: 'all',
    preload: [SUPPORTED_LNGS.ENGLISH, SUPPORTED_LNGS.FRENCH]
  },

  resourceLoader: (language, namespace) => import(`./app/i18n/locales/${language}/${namespace}_${language}.json`),
};

export default i18nConfig;
