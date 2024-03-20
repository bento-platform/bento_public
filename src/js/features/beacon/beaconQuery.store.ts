import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload, BeaconQueryResponse } from '@/types/beacon';
import { ChartData } from '@/types/data';
import { BEACON_URL } from '@/config';

const beaconIndividualsEndpoint = BEACON_URL + '/individuals';

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beaconQuery/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  const headers = makeAuthorizationHeader(token);
  return axios
    .post(beaconIndividualsEndpoint, payload, { headers })
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconQueryInitialStateType = {
  isFetchingQueryResponse: boolean;
  response: BeaconQueryResponse;
  individualCount: number;
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
  hasApiError: boolean;
  apiErrorMessage: string;
};

const initialState: BeaconQueryInitialStateType = {
  isFetchingQueryResponse: false,
  response: {},
  individualCount: 0,
  biosampleCount: 0,
  biosampleChartData: [],
  experimentCount: 0,
  experimentChartData: [],
  hasApiError: false,
  apiErrorMessage: '',
};

const beaconQuery = createSlice({
  name: 'beaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.hasApiError = false;
      state.apiErrorMessage = '';
      state.isFetchingQueryResponse = true;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      if (payload.info?.bento) {
        state.biosampleCount = payload.info.bento?.biosamples?.count;
        state.biosampleChartData = serializeChartData(payload.info.bento?.biosamples?.sampled_tissue);
        state.experimentCount = payload.info.bento?.experiments?.count;
        state.experimentChartData = serializeChartData(payload.info.bento?.experiments?.experiment_type);
      }
      if (payload.responseSummary) {
        state.individualCount = payload.responseSummary.numTotalResults;
      }
      state.hasApiError = false;
      state.apiErrorMessage = '';
      state.isFetchingQueryResponse = false;
    });
    builder.addCase(makeBeaconQuery.rejected, (state, action) => {
      state.hasApiError = true;
      state.apiErrorMessage = action.payload as string; //passed from rejectWithValue
      state.isFetchingQueryResponse = false;
    });
  },
});

export default beaconQuery.reducer;
