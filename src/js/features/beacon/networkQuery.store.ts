import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState, AppDispatch } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import type { BeaconQueryPayload, BeaconQueryResponse, FlattenedBeaconResponse } from '@/types/beacon';
import type { BeaconFlattenedAggregateResponse, QueryToNetworkBeacon } from '@/types/beaconNetwork';
import type { ChartData } from '@/types/data';
import { BEACON_NETWORK_URL } from '@/config';

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = '/individuals';

const queryUrl = (beaconId: string, endpoint: string): string => {
  return BEACON_NETWORK_URL + '/beacons/' + beaconId + endpoint;
};

// dispatch a query for each beacon in the network
export const beaconNetworkQuery =
  (payload: BeaconQueryPayload) => (dispatch: AppDispatch, getState: () => RootState) => {
    const beacons = getState().beaconNetwork.beacons;
    beacons.forEach((b) => {
      const url = queryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
      dispatch(queryBeaconNetworkNode({ beaconId: b.id, url: url, payload: payload }));
    });
  };

const queryBeaconNetworkNode = createAsyncThunk<
  BeaconQueryResponse,
  QueryToNetworkBeacon,
  { state: RootState; rejectValue: string }
>('queryBeaconNetworkNode', async ({ beaconId, url, payload }, { rejectWithValue }) => {
  // currently no auth in beacon network
  // these would only make sense if we start creating tokens that apply to more than one bento instance
  // const token = getState().auth.accessToken;
  // const headers = makeAuthorizationHeader(token);

  return axios
    .post(url, payload)
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

interface beaconNetworkStateType {
  networkResponseStatus: "idle" | "waiting" | "responding";
  networkResults: BeaconFlattenedAggregateResponse;
  beacons: {
    [beaconId: string]: FlattenedBeaconResponse;
  };
}

type TempChartObject = Record<string, number>;

const initialState: beaconNetworkStateType = {
  networkResponseStatus: "idle", 
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
    overview.individualCount += b.individualCount ?? 0;
    overview.biosampleCount += b.biosampleCount ?? 0;
    overview.experimentCount += b.experimentCount ?? 0;
    overview.biosampleChartData = mergeCharts(overview.biosampleChartData, b.biosampleChartData ?? []);
    overview.experimentChartData = mergeCharts(overview.experimentChartData, b.experimentChartData ?? []);
  });
  return overview;
};

// reducers handle individual beacon responses and update summed network stats
const queryBeaconNetworkNodeSlice = createSlice({
  name: 'queryBeaconNetworkNode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(queryBeaconNetworkNode.pending, (state, action) => {
      const beaconId = action.meta.arg.beaconId;
      const beaconState = {
        hasApiError: false,
        apiErrorMessage: '',
        isFetchingQueryResponse: true,
      };
      state.beacons[beaconId] = beaconState;

      // don't undo "responding" status if another beacon is already responding
      if (state.networkResponseStatus == "idle") {
        state.networkResponseStatus = "waiting"
      }
    });
    builder.addCase(queryBeaconNetworkNode.fulfilled, (state, action) => {

      console.log({action})



      const beaconId = action.meta.arg.beaconId;
      const { payload } = action;
      const hasErrorResponse = Object.prototype.hasOwnProperty.call(payload, 'error');
      const beaconState: FlattenedBeaconResponse = {
        hasApiError: hasErrorResponse,
        apiErrorMessage: hasErrorResponse ? (payload.error?.errorMessage ?? 'error') : '',
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
      state.networkResponseStatus = "responding";
      state.networkResults = computeNetworkResults(state.beacons);
    });
    builder.addCase(queryBeaconNetworkNode.rejected, (state, action) => {
      const beaconId = action.meta.arg.beaconId;
      const beaconState: FlattenedBeaconResponse = {
        hasApiError: true,
        apiErrorMessage: action.payload as string, //passed from rejectWithValue
        isFetchingQueryResponse: false,
      };
      state.beacons[beaconId] = beaconState;
      state.networkResponseStatus = "responding";
    });
  },
});

export default queryBeaconNetworkNodeSlice.reducer;
