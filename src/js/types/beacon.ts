import type { ReactNode } from 'react';
import type { Rule } from 'antd/es/form';
import type { ActionCreator } from 'redux';
import type { Datum } from '@/types/overviewResponse';
import type { makeBeaconQuery } from '@/features/beacon/beacon.store';
import type { beaconNetworkQuery } from '@/features/beacon/network.store';
import type { OptionalDiscoveryResults } from '@/types/data';
import type { Dataset } from '@/types/metadata';
import type { RequestStatus } from '@/types/requests';

// ----------------------------
// form handling
// ----------------------------

export type BeaconAssemblyIds = string[];

export interface FormField {
  name: string;
  rules?: Rule[];
  placeholder: string;
  initialValue: string;
}

export interface FormFilter {
  index: number;
  searchFieldId: string | null;
}

export interface FormValues {
  [key: string]: string;
}

export interface FilterOption {
  label: string;
  options: FilterPullDownKey[];
}

export interface FilterPullDownKey {
  disabled: boolean;
  label: ReactNode;
  value: string;
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

export interface BeaconPayloadFilter {
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
  query: {
    requestParameters: { g_variant: PayloadVariantsQuery };
    filters: BeaconPayloadFilter[];
    datasets?: { datasetIds: [Dataset['identifier']] };
  };
  bento?: { showSummaryStatistics: boolean };
}

export type BeaconQueryAction = ActionCreator<
  ReturnType<typeof beaconNetworkQuery> | ReturnType<typeof makeBeaconQuery>
>;

// ----------------------------
// API response
// ----------------------------

// generic "info" response field
// only requirement in beacon spec is that it's an object
type GenericInfoField = Record<string, unknown>;

export interface BeaconConfigResponse {
  response?: {
    overview?: {
      variants: {
        [key: string]: string;
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
// filters
// ----------------------------

// https://docs.genomebeacons.org/filters/
export interface BeaconFilteringTermsResponse {
  meta?: {
    beaconId: string;
  };
  response?: {
    filteringTerms: BeaconFilteringTermFromEndpoint[];
  };
}

export interface BeaconFilteringTermFromEndpoint {
  type: 'alphanumeric';
  id: string;
  label: string;
  description: string;
  values: string[];
  bento: {
    section: string;
  };
  units?: string;
}

export type BeaconFilterUiOptions = Omit<BeaconFilteringTermFromEndpoint, 'bento'>;

export interface BeaconFilterSection {
  section_title: string;
  fields: BeaconFilterUiOptions[];
}

// ----------------------------
// response packaging
// ----------------------------

export interface FlattenedBeaconResponse {
  queryStatus: RequestStatus;
  apiErrorMessage: string; // if non-blank, an error has occurred
  results: OptionalDiscoveryResults;
}

export type BeaconNetworkResponses = {
  [beaconId: string]: FlattenedBeaconResponse;
};
