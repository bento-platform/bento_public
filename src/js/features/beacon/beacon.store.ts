import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import { authorizedRequestConfig } from '@/utils/requests';

import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import { BEACON_INFO_ENDPOINT } from '@/features/beacon/constants';
import type { RootState } from '@/store';
import type {
  BeaconConfigResponse,
  BeaconAssemblyIds,
  BeaconQueryResponse,
  BeaconQueryPayload,
  BeaconFilterSection,
  BeaconFilteringTermsResponse,
} from '@/types/beacon';
import type { DiscoveryResults } from '@/types/data';
import { beaconApiError, errorMsgOrDefault } from '@/utils/beaconApiError';
import { printAPIError } from '@/utils/error.util';

import {
  extractBeaconDiscoveryOverview,
  scopedBeaconIndividualsUrl,
  scopedBeaconFilteringTermsUrl,
  packageBeaconFilteringTerms,
} from './utils';

// config response is not scoped
export const getBeaconConfig = createAsyncThunk<BeaconConfigResponse, void, { state: RootState; rejectValue: string }>(
  'beacon/getBeaconConfig',
  (_, { rejectWithValue }) => {
    return axios
      .get(BEACON_INFO_ENDPOINT)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return !getState().beacon.isFetchingBeaconConfig;
    },
  }
);

export const getBeaconFilters = createAsyncThunk<
  BeaconFilteringTermsResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  'beacon/getBeaconFilters',
  (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    const projectId = getState().metadata.selectedScope.scope.project;
    const datasetId = getState().metadata.selectedScope.scope.dataset;

    return axios
      .get(scopedBeaconFilteringTermsUrl(projectId, datasetId), authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().metadata.selectedScope.scopeSet && !getState().beacon.isFetchingFilters;
    },
  }
);

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beacon/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  const projectId = getState().metadata.selectedScope.scope.project;
  const headers = makeAuthorizationHeader(token);
  return axios
    .post(scopedBeaconIndividualsUrl(projectId), payload, authorizedRequestConfig(getState()))
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconState = {
  // config
  isFetchingBeaconConfig: boolean;
  beaconAssemblyIds: BeaconAssemblyIds;

  // filters
  isFetchingFilters: boolean;
  beaconFilters: BeaconFilterSection[];

  // querying
  isFetchingQueryResponse: boolean;
  results: DiscoveryResults;
  apiErrorMessage: string;
};

const initialState: BeaconState = {
  // config
  isFetchingBeaconConfig: false,
  beaconAssemblyIds: [],

  // filters
  isFetchingFilters: false,
  beaconFilters: [],

  // querying
  isFetchingQueryResponse: false,
  results: EMPTY_DISCOVERY_RESULTS,
  apiErrorMessage: '',
};

const beacon = createSlice({
  name: 'beacon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // config ----------------------------------------------------------------------------------------------------------
    builder.addCase(getBeaconConfig.pending, (state) => {
      state.isFetchingBeaconConfig = true;
    });
    builder.addCase(getBeaconConfig.fulfilled, (state, { payload }) => {
      state.beaconAssemblyIds = Object.keys(payload.response?.overview?.counts?.variants ?? []);
      state.isFetchingBeaconConfig = false;
    });
    builder.addCase(getBeaconConfig.rejected, (state) => {
      state.isFetchingBeaconConfig = false;
    });

    // filtering terms -------------------------------------------------------------------------------------------------
    builder.addCase(getBeaconFilters.pending, (state) => {
      state.isFetchingFilters = true;
    });
    builder.addCase(getBeaconFilters.fulfilled, (state, { payload }) => {
      state.beaconFilters = packageBeaconFilteringTerms(payload?.response?.filteringTerms ?? []);
      state.isFetchingFilters = false;
    });
    builder.addCase(getBeaconFilters.rejected, (state) => {
      state.isFetchingFilters = false;
    });

    // querying --------------------------------------------------------------------------------------------------------
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.apiErrorMessage = '';
      state.isFetchingQueryResponse = true;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      state.results = {
        ...state.results,
        ...extractBeaconDiscoveryOverview(payload),
      };
      state.apiErrorMessage = '';
      state.isFetchingQueryResponse = false;
    });
    builder.addCase(makeBeaconQuery.rejected, (state, action) => {
      // apiErrorMessage must be non-blank to be treated as an error -- if no error is received, but one occurred, use a
      // generic fallback.
      state.apiErrorMessage = errorMsgOrDefault(action.payload); // passed from rejectWithValue
      state.isFetchingQueryResponse = false;
    });
  },
});

export default beacon.reducer;
