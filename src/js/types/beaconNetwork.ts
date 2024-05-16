import { BeaconQueryResponse } from "./beacon";
import { ChartData } from "./data";

export interface BeaconOrgDetails {
  logoUrl: string;
  name: string;
  id: string;
  welcomeUrl: string;
  contactUrl: string;
}

// TODO, should probably standardize with standard response
export interface BeaconNetworkResponse {
  individualCount: number;
  biosampleCount: number;
  experimentCount: number;
  biosampleChartData: ChartData[],
  experimentChartData: ChartData[],
}

export interface RespondingBeacon {
  organization: BeaconOrgDetails;
  response: BeaconNetworkResponse; //or something else
  bentoUrl: string;
  description: string;
}

