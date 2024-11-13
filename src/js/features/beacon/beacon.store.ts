import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';

import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import { BEACON_INDIVIDUALS_ENDPOINT, BEACON_INFO_ENDPOINT } from '@/features/beacon/constants';
import type { RootState } from '@/store';
import type { BeaconAssemblyIds, BeaconConfigResponse, BeaconQueryPayload, BeaconQueryResponse } from '@/types/beacon';
import type { DiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';
import { beaconApiError, errorMsgOrDefault } from '@/utils/beaconApiError';
import { printAPIError } from '@/utils/error.util';

import { extractBeaconDiscoveryOverview } from './utils';

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
      const state = getState().beacon;
      return state.beaconConfigStatus === RequestStatus.Idle;
    },
  }
);

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beacon/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  const headers = makeAuthorizationHeader(token);
  return axios
    .post(BEACON_INDIVIDUALS_ENDPOINT, payload, { headers: headers as Record<string, string> })
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconState = {
  // config
  beaconConfigStatus: RequestStatus;
  beaconAssemblyIds: BeaconAssemblyIds;

  // querying
  queryResponseStatus: RequestStatus;
  queryResponseIsInvalid: boolean;
  results: DiscoveryResults;
  apiErrorMessage: string;
};

const initialState: BeaconState = {
  // config
  beaconConfigStatus: RequestStatus.Idle,
  beaconAssemblyIds: [],

  // querying
  queryResponseStatus: RequestStatus.Idle,
  queryResponseIsInvalid: false,
  results: EMPTY_DISCOVERY_RESULTS,
  apiErrorMessage: '',
};

const beacon = createSlice({
  name: 'beacon',
  initialState,
  reducers: {
    invalidateQueryResponse(state) {
      state.queryResponseIsInvalid = true;
    },
  },
  extraReducers: (builder) => {
    // config ----------------------------------------------------------------------------------------------------------
    builder.addCase(getBeaconConfig.pending, (state) => {
      state.beaconConfigStatus = RequestStatus.Pending;
    });
    builder.addCase(getBeaconConfig.fulfilled, (state, { payload }) => {
      state.beaconAssemblyIds = Object.keys(payload.response?.overview?.counts?.variants ?? []);
      state.beaconConfigStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getBeaconConfig.rejected, (state) => {
      state.beaconConfigStatus = RequestStatus.Rejected;
    });

    // querying --------------------------------------------------------------------------------------------------------
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.apiErrorMessage = '';
      state.queryResponseStatus = RequestStatus.Pending;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      state.results = {
        ...state.results,
        ...extractBeaconDiscoveryOverview(payload),
      };
      state.apiErrorMessage = '';
      state.queryResponseStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(makeBeaconQuery.rejected, (state, action) => {
      // apiErrorMessage must be non-blank to be treated as an error -- if no error is received, but one occurred, use a
      // generic fallback.
      state.apiErrorMessage = errorMsgOrDefault(action.payload); // passed from rejectWithValue
      state.queryResponseStatus = RequestStatus.Rejected;
    });
  },
});

export default beacon.reducer;
