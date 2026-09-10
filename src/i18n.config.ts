import type { I18nConfig } from 'next-i18next/proxy';
import { PCGL_MODE, TRANSLATED } from '@/config';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

const i18nConfig: I18nConfig = {
  supportedLngs: TRANSLATED ? Object.values(SUPPORTED_LNGS) : ['en'],
  fallbackLng: 'en',
  defaultNS: 'translation',
  ns: ['translation', ...(PCGL_MODE ? ['pcgl_translation'] : []), 'default_translation'],

  resourceLoader: (language, namespace) => import(`./app/i18n/locales/${language}/${namespace}.json`),
};

export default i18nConfig;
