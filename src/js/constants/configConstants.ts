import { PORTAL_URL } from '@/config';

export const MAX_CHARTS = 3;

export const katsuPublicOverviewUrl = `${PORTAL_URL}/api/metadata/api/public_overview`;
export const katsuPublicRulesUrl = `${PORTAL_URL}/api/metadata/api/public_rules`;
export const searchFieldsUrl = `${PORTAL_URL}/api/metadata/api/public_search_fields`;
export const katsuPublicSearchUrl = `${PORTAL_URL}/api/metadata/api/public`;
export const provenanceUrl = `${PORTAL_URL}/api/metadata/api/public_dataset`;
export const projectsUrl = `${PORTAL_URL}/api/metadata/api/projects`;
export const katsuLastIngestionsUrl = `${PORTAL_URL}/api/metadata/data-types`;
export const gohanLastIngestionsUrl = `${PORTAL_URL}/api/gohan/data-types`;

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
