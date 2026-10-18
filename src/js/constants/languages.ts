// No imports from '@/config' here: this module is also used server-side (proxy.ts, the [lang] layout), where the
// browser-side public config doesn't exist.

export const SUPPORTED_LNGS = {
  ENGLISH: 'en',
  FRENCH: 'fr',
};

export const SUPPORTED_LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
