import { BeaconServiceInfo, BeaconQueryPayload, FlattenedBeaconResponse } from './beacon';
import { ChartData } from './data';

export interface NetworkBeacon extends BeaconServiceInfo {
  apiUrl: string;
  overview?: any; // to update as design settles
  // queryResponse?: FlattenedBeaconResponse
}

// more to come
export interface BeaconNetworkConfig {
  filtersUnion: any; // temp
  filtersIntersection: any; // temp
  beacons: NetworkBeacon[];
}

export interface BeaconOrgDetails {
  logoUrl: string;
  name: string;
  id: string;
  welcomeUrl: string;
  contactUrl: string;
}

// TODO, should probably standardize with standard response
export interface BeaconFlattenedAggregateResponse {
  individualCount: number;
  biosampleCount: number;
  experimentCount: number;
  biosampleChartData: ChartData[];
  experimentChartData: ChartData[];
}

export interface RespondingBeacon {
  organization: BeaconOrgDetails;
  response: FlattenedBeaconResponse; //or something else
  bentoUrl: string;
  description: string;
}

export type BeaconNetworkAggregatedResponse = RespondingBeacon[];

export interface QueryToNetworkBeacon {
  beaconId: string;
  url: string;
  payload: BeaconQueryPayload;
}
