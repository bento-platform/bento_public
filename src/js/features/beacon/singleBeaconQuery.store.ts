import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload, BeaconQueryResponse, FlattenedBeaconState } from '@/types/beacon';
import { QueryToNetworkBeacon } from '@/types/beaconNetwork';
import { ChartData } from '@/types/data';

// TODO (eventually): deduplicate with beaconQuery.store.ts

export const singleBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  QueryToNetworkBeacon,
  { state: RootState; rejectValue: string }
>('singleBeaconQuery', async ({ beaconId, url, payload }, { rejectWithValue }) => {
  // currently no auth in beacon network
  // these would only make sense if we start creating tokens that apply to more than one bento instance
  // const token = getState().auth.accessToken;
  // const headers = makeAuthorizationHeader(token);

  console.log('singleBeaconQuery()');

  return axios
    .post(url, payload)
    .then((res) => {
      const data = res.data;
      data.beaconid = beaconId;
      return data;
    })
    .catch(beaconApiError(rejectWithValue));
});

interface beaconNetworkStateType {
  respondingBeacons: {
    [beaconId: string]: FlattenedBeaconState;
  };
}

const initialState: beaconNetworkStateType = {
  respondingBeacons: {},
};

const singleBeaconQuerySlice = createSlice({
  name: 'singleBeaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(singleBeaconQuery.pending, (state, action) => {
      console.log('singleBeaconQuery.pending');
      const beaconId = action.meta.arg.beaconId;
      const beaconState = {
        hasApiError: false,
        apiErrorMessage: '',
        isFetchingQueryResponse: true,
      };
      state.respondingBeacons[beaconId] = beaconState;
    });
    builder.addCase(singleBeaconQuery.fulfilled, (state, action) => {
      console.log('singleBeaconQuery.fulfilled');
      const beaconId = action.meta.arg.beaconId;
      const { payload } = action;
      const beaconState: FlattenedBeaconState = {
        hasApiError: false,
        apiErrorMessage: '',
        isFetchingQueryResponse: false,
      };
      if (payload.info?.bento) {
        beaconState.biosampleCount = payload.info.bento?.biosamples?.count;
        beaconState.biosampleChartData = serializeChartData(payload.info.bento?.biosamples?.sampled_tissue);
        beaconState.experimentCount = payload.info.bento?.experiments?.count;
        beaconState.experimentChartData = serializeChartData(payload.info.bento?.experiments?.experiment_type);
      }
      if (payload.responseSummary) {
        beaconState.individualCount = payload.responseSummary.numTotalResults;
      }
      state.respondingBeacons[beaconId] = beaconState;
    });
    builder.addCase(singleBeaconQuery.rejected, (state, action) => {
      console.log('singleBeaconQuery.rejected');
      const beaconId = action.meta.arg.beaconId;
      const beaconState: FlattenedBeaconState = {
        hasApiError: true,
        apiErrorMessage: action.payload as string, //passed from rejectWithValue
        isFetchingQueryResponse: false,
      };
      state.respondingBeacons[beaconId] = beaconState;
    });
  },
});

export default singleBeaconQuerySlice.reducer;
