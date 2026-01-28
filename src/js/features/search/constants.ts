import type { DiscoveryResults } from '@/types/data';

export const NO_RESULTS_DASHES = '———';

export const EMPTY_DISCOVERY_RESULTS: DiscoveryResults = {
  // individuals
  individualCount: 0,
  individualMatches: undefined,
  // biosamples
  biosampleCount: 0,
  biosampleChartData: [],
  // experiments
  experimentCount: 0,
  experimentChartData: [],
};

export const NON_FILTER_QUERY_PARAM_PREFIX = '_';
export const ENTITY_QUERY_PARAM = '_e';
export const TABLE_PAGE_QUERY_PARAM = '_p';
export const TABLE_PAGE_SIZE_QUERY_PARAM = '_ps';
export const TEXT_QUERY_PARAM = '_q';
