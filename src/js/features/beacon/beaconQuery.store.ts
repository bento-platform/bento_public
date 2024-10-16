import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';

import { BEACON_URL } from '@/config';
import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import type { RootState } from '@/store';
import type { BeaconQueryPayload, BeaconQueryResponse } from '@/types/beacon';
import type { DiscoveryResults } from '@/types/data';
import { beaconApiError, errorMsgOrDefault } from '@/utils/beaconApiError';
import { serializeChartData } from '@/utils/chart';

const beaconIndividualsEndpoint = BEACON_URL + '/individuals';

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beaconQuery/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  const headers = makeAuthorizationHeader(token);
  return axios
    .post(beaconIndividualsEndpoint, payload, { headers: headers as Record<string, string> })
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconQueryState = {
  isFetchingQueryResponse: boolean;
  results: DiscoveryResults;
  apiErrorMessage: string;
};

const initialState: BeaconQueryState = {
  isFetchingQueryResponse: false,
  results: EMPTY_DISCOVERY_RESULTS,
  apiErrorMessage: '',
};

const beaconQuery = createSlice({
  name: 'beaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.apiErrorMessage = '';
      state.isFetchingQueryResponse = true;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      if (payload.info?.bento) {
        state.results = {
          ...state.results,
          biosampleCount: payload.info.bento?.biosamples?.count,
          biosampleChartData: serializeChartData(payload.info.bento?.biosamples?.sampled_tissue),
          experimentCount: payload.info.bento?.experiments?.count,
          experimentChartData: serializeChartData(payload.info.bento?.experiments?.experiment_type),
        };
      }
      if (payload.responseSummary) {
        state.results.individualCount = payload.responseSummary.numTotalResults;
      }
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

export default beaconQuery.reducer;
