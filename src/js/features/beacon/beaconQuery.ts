import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error.util';
import { RootState } from '@/store';
import { BeaconQueryResponse } from '@/types/beacon';
import { serializeChartData } from '@/utils/chart';
import { ChartData } from '@/types/data';

export const makeBeaconQuery = createAsyncThunk<BeaconQueryResponse, void, { state: RootState; rejectValue: string }>(
  'beaconQuery/makeBeaconQuery',
  async (payload, { getState }) => {
    const beaconIndividualsEndpoint = getState()?.config?.beaconUrl + '/individuals';
    return axios
      .post(beaconIndividualsEndpoint, payload)
      .then((res) => res.data)
      .catch(printAPIError);
  }
);

type BeaconQueryInitialStateType = {
  isFetchingQueryResponse: boolean;
  response: BeaconQueryResponse;
  individualCount: number;
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
};

const initialState: BeaconQueryInitialStateType = {
  isFetchingQueryResponse: false,
  response: {},
  individualCount: 0,
  biosampleCount: 0,
  biosampleChartData: [],
  experimentCount: 0,
  experimentChartData: [],
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
        state.individualCount = payload.responseSummary.count;
      }
      state.isFetchingQueryResponse = false;
    });
    builder.addCase(makeBeaconQuery.rejected, (state) => {
      state.isFetchingQueryResponse = false;
    });
  },
});

export default beaconQuery.reducer;
