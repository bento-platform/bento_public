import type { BeaconServiceInfo, BeaconQueryPayload } from '@/types/beacon';
import type { Section } from '@/types/search';

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
  filtersUnion: Section[];
  filtersIntersection: Section[];
  beacons: NetworkBeacon[];
}

export interface QueryToNetworkBeacon {
  _beaconId: string;
  url: string;
  payload: BeaconQueryPayload;
}