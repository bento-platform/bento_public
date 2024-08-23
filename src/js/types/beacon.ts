import { Rule } from 'antd/es/form';
import { Datum } from '@/types/overviewResponse';
import { ChartData } from './data';

// ----------------------------
// form handling
// ----------------------------

export type BeaconAssemblyIds = string[];

// generic "info" response field
// only requirement in beacon spec is that it's an object
type GenericInfoField = Record<string, unknown>;

export interface FormField {
  name: string;
  rules?: Rule[];
  placeholder: string;
  initialValue: string;
}

export interface FormFilter {
  index: number;
  active: boolean;
}

export interface FormValues {
  [key: string]: string;
}

export interface FilterOption {
  label: string;
  options: FilterPullDownKey[];
}

export interface FilterPullDownKey {
  label: string;
  optionsThisKey: FilterPullDownValue[];
}

export interface FilterPullDownValue {
  label: string;
  value: string;
}

export type GenericOptionType = FilterOption | FilterPullDownKey;

// ----------------------------
// API request
// ----------------------------

export interface PayloadFilter {
  id: string;
  value: string;

  //inequalities handled in "value", not operator
  // no negation yet in UI (but exists in API)
  operator: '=';
}

type EmptyObject = Record<string, never>;

export type PayloadVariantsQuery =
  | {
      referenceName: string;
      referenceBases?: string;
      alternateBases?: string;
      assemblyId: string;
      start: number[];
      end?: number[];
    }
  | EmptyObject;

export interface BeaconQueryPayload {
  meta: { apiVersion: string };
  query: { requestParameters: { g_variant: PayloadVariantsQuery }; filters: PayloadFilter[] };
  bento?: { showSummaryStatistics: boolean };
}

// export type BeaconQueryThunk = AsyncThunk<void | BeaconQueryResponse, BeaconQueryPayload, unknown>
export type BeaconQueryThunk = unknown;

// ----------------------------
// API response
// ----------------------------

export interface BeaconConfigResponse {
  response?: {
    overview?: {
      counts?: {
        // individuals: number;
        variants?: {
          [key: string]: string;
        };
      };
    };
  };
}

export interface BeaconQueryResponse {
  info?: {
    bento: {
      biosamples: {
        count: number;
        sampled_tissue: Datum[];
      };
      experiments: {
        count: number;
        experiment_type: Datum[];
      };
    };
  };
  responseSummary?: {
    numTotalResults: number;
  };
  meta?: {
    beaconId: string;
  };
  error?: {
    errorCode: number;
    errorMessage: string;
  };
}

export interface BeaconErrorData {
  error?: {
    errorCode: number;
    errorMessage: string;
  };
}

export interface BeaconOrganizationType {
  id: string;
  name: string;
  description?: string;
  address?: string;
  contactUrl?: string;
  logoUrl?: string;
  welcomeUrl?: string;
  info?: GenericInfoField;
}

export interface BeaconServiceInfo {
  id: string;
  name: string;
  apiVersion: string;
  environment: string;
  organization: BeaconOrganizationType;
  description?: string;
  version?: string;
  welcomeUrl?: string;
  alternativeUrl?: string;
  info?: GenericInfoField;
}

// ----------------------------
// response packaging
// ----------------------------

export interface FlattenedBeaconResponse {
  isFetchingQueryResponse: boolean;
  hasApiError: boolean;
  apiErrorMessage: string;
  individualCount?: number;
  biosampleCount?: number;
  biosampleChartData?: ChartData[];
  experimentCount?: number;
  experimentChartData?: ChartData[];
}
