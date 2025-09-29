import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';

export const MAX_CHARTS = 3;

const katsuBaseUrl = `${PUBLIC_URL_NO_TRAILING_SLASH}/api/metadata`;

// Katsu discovery URLs
export const katsuDiscoveryRulesUrl = `${katsuBaseUrl}/api/discovery_rules`;
export const katsuDiscoverySearchFieldsUrl = `${katsuBaseUrl}/api/discovery_search_fields`;
export const katsuDiscoveryUrl = `${katsuBaseUrl}/api/discovery`;
export const katsuDiscoveryMatchesUrl = `${katsuBaseUrl}/api/discovery_matches`;

// Katsu entity API (Django Rest Framework) base URLs
export const projectsUrl = `${katsuBaseUrl}/api/projects`;
export const datasetsUrl = `${katsuBaseUrl}/api/datasets`;
export const individualUrl = `${katsuBaseUrl}/api/individuals`;
export const individualBatchUrl = `${katsuBaseUrl}/api/batch/individuals`;
export const phenopacketUrl = `${katsuBaseUrl}/api/phenopackets`;
export const biosampleUrl = `${katsuBaseUrl}/api/biosamples`;
export const biosampleBatchUrl = `${katsuBaseUrl}/api/batch/biosamples`;
export const experimentUrl = `${katsuBaseUrl}/api/experiments`;
export const experimentBatchUrl = `${katsuBaseUrl}/api/batch/experiments`;

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
