import type { BeaconServiceInfo, BeaconQueryPayload, FlattenedBeaconResponse } from '@/types/beacon';
import type { ChartData } from '@/types/data';
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
    variants: Record<string, number>
  };
}

// more to come here
export interface BeaconNetworkConfig {
  filtersUnion: Section[]
  filtersIntersection: Section[]
  beacons: NetworkBeacon[];
}

export interface BeaconOrgDetails {
  logoUrl: string;
  name: string;
  id: string;
  welcomeUrl: string;
  contactUrl: string;
}

// could probably align this with standard beacon response
export interface BeaconFlattenedAggregateResponse {
  individualCount: number;
  biosampleCount: number;
  experimentCount: number;
  biosampleChartData: ChartData[];
  experimentChartData: ChartData[];
}

export interface RespondingBeacon {
  organization: BeaconOrgDetails;
  response: FlattenedBeaconResponse;
  bentoUrl: string;
  description: string;
}

export type BeaconNetworkAggregatedResponse = RespondingBeacon[];

export interface QueryToNetworkBeacon {
  beaconId: string;
  url: string;
  payload: BeaconQueryPayload;
}
