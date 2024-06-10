import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import { ChartData } from '@/types/data';
import { BeaconQueryPayload, BeaconQueryResponse, FlattenedBeaconResponse } from '@/types/beacon';
import { BeaconFlattenedAggregateResponse, QueryToNetworkBeacon } from '@/types/beaconNetwork';

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
  networkResults: BeaconFlattenedAggregateResponse;
  beacons: {
    [beaconId: string]: FlattenedBeaconResponse;
  };
}

type TempChartObject = Record<string, number>;

const initialState: beaconNetworkStateType = {
  networkResults: {
    individualCount: 0,
    biosampleCount: 0,
    experimentCount: 0,
    biosampleChartData: [],
    experimentChartData: [],
  },
  beacons: {},
};

const chartArrayToChartObj = (cArr: ChartData[]): TempChartObject => {
  const obj: TempChartObject = {};
  cArr.forEach((c) => {
    obj[c.x] = c.y;
  });
  return obj;
};

const chartObjToChartArr = (cObj: TempChartObject): ChartData[] => {
  const arr = [];
  for (const key in cObj) {
    arr.push({ x: key, y: cObj[key] });
  }
  return arr;
};

const mergeCharts = (c1: ChartData[], c2: ChartData[]): ChartData[] => {
  const merged = chartArrayToChartObj(c1);
  c2.forEach((c) => {
    merged[c.x] = (merged[c.x] ?? 0) + c.y;
  });
  return chartObjToChartArr(merged);
};

const computeNetworkResults = (beacons: beaconNetworkStateType['beacons']) => {
  const overview: BeaconFlattenedAggregateResponse = {
    individualCount: 0,
    biosampleCount: 0,
    experimentCount: 0,
    biosampleChartData: [],
    experimentChartData: [],
  };

  Object.values(beacons).forEach((b) => {
    console.log({ thing: b });
    overview.individualCount += b.individualCount ?? 0;
    overview.biosampleCount += b.biosampleCount ?? 0;
    overview.experimentCount += b.experimentCount ?? 0;
    overview.biosampleChartData = mergeCharts(overview.biosampleChartData, b.biosampleChartData ?? []);
    overview.experimentChartData = mergeCharts(overview.experimentChartData, b.experimentChartData ?? []);
  });
  return overview;
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
      const hasErrorResponse = payload.hasOwnProperty('error');

      const beaconState: FlattenedBeaconResponse = {
        hasApiError: hasErrorResponse,
        apiErrorMessage: hasErrorResponse ? payload.error?.errorMessage ?? 'error' : '',
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
      state.networkResults = computeNetworkResults(state.beacons);
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
