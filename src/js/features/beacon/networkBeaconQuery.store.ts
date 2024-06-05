import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload, BeaconQueryResponse, FlattenedBeaconResponse } from '@/types/beacon';
import { QueryToNetworkBeacon } from '@/types/beaconNetwork';
import { ChartData } from '@/types/data';

// TODO (eventually): deduplicate with beaconQuery.store.ts

export const networkBeaconQuery = createAsyncThunk<
  BeaconQueryResponse,
  QueryToNetworkBeacon,
  { state: RootState; rejectValue: string }
>('networkBeaconQuery', async ({ beaconId, url, payload }, { rejectWithValue }) => {
  // currently no auth in beacon network
  // these would only make sense if we start creating tokens that apply to more than one bento instance
  // const token = getState().auth.accessToken;
  // const headers = makeAuthorizationHeader(token);

  console.log('networkBeaconQuery()');

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
  beacons: {
    [beaconId: string]: FlattenedBeaconResponse;
  };
}

const initialState: beaconNetworkStateType = {
  beacons: {},
};

const networkBeaconQuerySlice = createSlice({
  name: 'networkBeaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(networkBeaconQuery.pending, (state, action) => {
      console.log('networkBeaconQuery.pending');
      const beaconId = action.meta.arg.beaconId;
      const beaconState = {
        hasApiError: false,
        apiErrorMessage: '',
        isFetchingQueryResponse: true,
      };
      state.beacons[beaconId] = beaconState;
    });
    builder.addCase(networkBeaconQuery.fulfilled, (state, action) => {
      console.log('networkBeaconQuery.fulfilled');
      const beaconId = action.meta.arg.beaconId;
      const { payload } = action;
      const hasErrorResponse = payload.hasOwnProperty("error")

      const beaconState: FlattenedBeaconResponse = {
        hasApiError: hasErrorResponse,
        apiErrorMessage: hasErrorResponse ? payload.error?.errorMessage ?? "error" : "",    
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
      state.beacons[beaconId] = beaconState;
    });
    builder.addCase(networkBeaconQuery.rejected, (state, action) => {
      console.log('networkBeaconQuery.rejected');
      const beaconId = action.meta.arg.beaconId;
      const beaconState: FlattenedBeaconResponse = {
        hasApiError: true,
        apiErrorMessage: action.payload as string, //passed from rejectWithValue
        isFetchingQueryResponse: false,
      };
      state.beacons[beaconId] = beaconState;
    });
  },
});

export default networkBeaconQuerySlice.reducer;
