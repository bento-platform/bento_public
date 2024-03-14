import { PORTAL_URL } from '@/config';

export const MAX_CHARTS = 3;

export const katsuPublicOverviewUrl = `${PORTAL_URL}/api/metadata/api/public_overview`;
export const searchFieldsUrl = '/fields';
export const katsuUrl = '/katsu';
export const provenanceUrl = '/provenance';
export const katsuLastIngestionsUrl = '/katsu/data-types';
export const gohanLastIngestionsUrl = '/gohan/data-types';

export const DEFAULT_TRANSLATION = 'default_translation';
export const NON_DEFAULT_TRANSLATION = 'translation';

export const SUPPORTED_LNGS = {
  ENGLISH: 'en',
  FRENCH: 'fr',
};

// Language change from eng to fr, and vice-versa
export const LNG_CHANGE = {
  [SUPPORTED_LNGS.ENGLISH]: SUPPORTED_LNGS.FRENCH,
  [SUPPORTED_LNGS.FRENCH]: SUPPORTED_LNGS.ENGLISH,
};

export const LNGS_FULL_NAMES = {
  [SUPPORTED_LNGS.ENGLISH]: 'English',
  [SUPPORTED_LNGS.FRENCH]: 'Français',
};
