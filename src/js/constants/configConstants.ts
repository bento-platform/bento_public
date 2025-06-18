import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';

export const MAX_CHARTS = 3;

// Katsu discovery URLs
export const katsuPublicRulesUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/public_rules`;
export const searchFieldsUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/discovery_search_fields`;
export const katsuDiscoveryUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/discovery`;
export const katsuDiscoveryMatchesUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/discovery_matches`;

// Katsu entity API (Django Rest Framework) base URLs
export const projectsUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/projects`;
export const individualUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/individuals`;
export const phenopacketUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/phenopackets`;
export const individualBatchUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata/api/batch/individuals`;

export const referenceGenomesUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/reference/genomes`;

export const CUSTOMIZABLE_TRANSLATION = 'translation';

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
