import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { type AxiosRequestConfig } from 'axios';
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
import { RequestStatus } from '@/types/requests';
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
  (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    const reqConf: AxiosRequestConfig = {};
    if (token) {
      reqConf.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return axios
      .get(BEACON_INFO_ENDPOINT, reqConf)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().beacon.configStatus !== RequestStatus.Pending;
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
    const { project, dataset } = getState().metadata.selectedScope.scope;
    return axios
      .get(scopedBeaconFilteringTermsUrl(project, dataset), authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().metadata.selectedScope.scopeSet && getState().beacon.filtersStatus !== RequestStatus.Pending;
    },
  }
);

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beacon/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const projectId = getState().metadata.selectedScope.scope.project;
  return axios
    .post(scopedBeaconIndividualsUrl(projectId), payload, authorizedRequestConfig(getState()))
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconState = {
  // config
  configStatus: RequestStatus;
  beaconAssemblyIds: BeaconAssemblyIds;

  // filters
  filtersStatus: RequestStatus;
  beaconFilters: BeaconFilterSection[];

  // querying
  queryStatus: RequestStatus;
  results: DiscoveryResults;
  apiErrorMessage: string;
};

const initialState: BeaconState = {
  // config
  configStatus: RequestStatus.Idle,
  beaconAssemblyIds: [],

  // filters
  filtersStatus: RequestStatus.Idle,
  beaconFilters: [],

  // querying
  queryStatus: RequestStatus.Idle,
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
      state.configStatus = RequestStatus.Pending;
    });
    builder.addCase(getBeaconConfig.fulfilled, (state, { payload }) => {
      state.configStatus = RequestStatus.Fulfilled;
      state.beaconAssemblyIds = Object.keys(payload.response?.overview?.counts?.variants ?? []);
    });
    builder.addCase(getBeaconConfig.rejected, (state) => {
      state.configStatus = RequestStatus.Rejected;
    });

    // filtering terms -------------------------------------------------------------------------------------------------
    builder.addCase(getBeaconFilters.pending, (state) => {
      state.filtersStatus = RequestStatus.Pending;
    });
    builder.addCase(getBeaconFilters.fulfilled, (state, { payload }) => {
      state.beaconFilters = packageBeaconFilteringTerms(payload?.response?.filteringTerms ?? []);
      state.filtersStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getBeaconFilters.rejected, (state) => {
      state.filtersStatus = RequestStatus.Rejected;
    });

    // querying --------------------------------------------------------------------------------------------------------
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.apiErrorMessage = '';
      state.queryStatus = RequestStatus.Pending;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      state.results = {
        ...state.results,
        ...extractBeaconDiscoveryOverview(payload),
      };
      state.apiErrorMessage = '';
      state.queryStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(makeBeaconQuery.rejected, (state, action) => {
      // apiErrorMessage must be non-blank to be treated as an error -- if no error is received, but one occurred, use a
      // generic fallback.
      state.apiErrorMessage = errorMsgOrDefault(action.payload); // passed from rejectWithValue
      state.queryStatus = RequestStatus.Rejected;
    });
  },
});

export default beacon.reducer;
