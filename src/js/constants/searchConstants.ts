import type { DiscoveryResults } from '@/types/data';

export const NO_RESULTS_DASHES = '----';

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
