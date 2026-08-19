import type { BeaconFilteringTermFromEndpoint, BeaconServiceInfo, BeaconQueryPayload } from '@/types/beacon';

export interface NetworkBeacon extends BeaconServiceInfo {
  apiUrl: string;
  overview: {
    biosamples: {
      count: number;
    };
    experiments: {
      count: number;
    };
    individuals: {
      count: number;
    };
    variants: Record<string, number>;
  };
}

// more to come here
export interface BeaconNetworkConfig {
  filtersUnion: BeaconFilteringTermFromEndpoint[];
  filtersIntersection: BeaconFilteringTermFromEndpoint[];
  beacons: NetworkBeacon[];
}

export interface QueryToNetworkBeacon {
  _beaconId: string;
  url: string;
  payload: BeaconQueryPayload;
}
