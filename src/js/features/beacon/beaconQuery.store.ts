import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '@/store';
import { BeaconQueryPayload, BeaconQueryResponse } from '@/types/beacon';
import { serializeChartData } from '@/utils/chart';
import { beaconAPIError } from '@/utils/error.util';
import { ChartData } from '@/types/data';

export const makeBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  BeaconQueryPayload,
  { state: RootState; rejectValue: string }
>('beaconQuery/makeBeaconQuery', async (payload, { getState, rejectWithValue }) => {
  const beaconIndividualsEndpoint = getState()?.config?.beaconUrl + '/individuals';
  return axios
    .post(beaconIndividualsEndpoint, payload)
    .then((res) => res.data)
    .catch(beaconAPIError(rejectWithValue));
});

type BeaconQueryInitialStateType = {
  isFetchingQueryResponse: boolean;
  response: BeaconQueryResponse;
  individualCount: number;
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
  errorMessage: string
};

const initialState: BeaconQueryInitialStateType = {
  isFetchingQueryResponse: false,
  response: {},
  individualCount: 0,
  biosampleCount: 0,
  biosampleChartData: [],
  experimentCount: 0,
  experimentChartData: [],
  errorMessage: ""
};

const beaconQuery = createSlice({
  name: 'beaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.isFetchingQueryResponse = true;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      if (payload.info) {
        state.biosampleCount = payload.info.bento?.biosamples?.count;
        state.biosampleChartData = serializeChartData(payload.info.bento?.biosamples?.sampled_tissue);
        state.experimentCount = payload.info.bento?.experiments?.count;
        state.experimentChartData = serializeChartData(payload.info.bento?.experiments?.experiment_type);
      }
      if (payload.responseSummary) {
        state.individualCount = payload.responseSummary.numTotalResults;
      }
      state.isFetchingQueryResponse = false;
      state.errorMessage = ""
    });
    builder.addCase(makeBeaconQuery.rejected, (state, action) => {
      const errorMess = action.payload  //passed from rejectWithValue
      state.errorMessage = action.payload as string
      state.isFetchingQueryResponse = false;
    });
  },
});

export default beaconQuery.reducer;
