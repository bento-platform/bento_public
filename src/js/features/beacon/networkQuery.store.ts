import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BEACON_NETWORK_URL } from '@/config';
import type { AppDispatch, RootState } from '@/store';
import type { BeaconQueryPayload, BeaconQueryResponse, FlattenedBeaconResponse } from '@/types/beacon';
import type { QueryToNetworkBeacon } from '@/types/beaconNetwork';
import type { ChartData, DiscoveryResults } from '@/types/data';
import { beaconApiError, errorMsgOrDefault } from '@/utils/beaconApiError';
import { serializeChartData } from '@/utils/chart';

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = '/individuals';

const queryUrl = (beaconId: string, endpoint: string): string => {
  return BEACON_NETWORK_URL + '/beacons/' + beaconId + endpoint;
};

// dispatch a query for each beacon in the network
export const beaconNetworkQuery =
  (payload: BeaconQueryPayload) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { beacons } = getState().beaconNetwork;
    beacons.forEach((b) => {
      const url = queryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
      dispatch(queryBeaconNetworkNode({ _beaconId: b.id, url: url, payload: payload }));
    });
  };

const queryBeaconNetworkNode = createAsyncThunk<
  BeaconQueryResponse,
  QueryToNetworkBeacon,
  { state: RootState; rejectValue: string }
>('queryBeaconNetworkNode', async ({ url, payload }, { rejectWithValue }) => {
  // currently no auth in beacon network
  // these would only make sense if we start creating tokens that apply to more than one bento instance
  // const token = getState().auth.accessToken;
  // const headers = makeAuthorizationHeader(token);

  return axios
    .post(url, payload)
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

interface BeaconNetworkQueryState {
  networkResponseStatus: 'idle' | 'waiting' | 'responding';
  networkResults: DiscoveryResults;
  beacons: {
    [beaconId: string]: FlattenedBeaconResponse;
  };
}

type TempChartObject = Record<string, number>;

const initialState: BeaconNetworkQueryState = {
  networkResponseStatus: 'idle',
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

const computeNetworkResults = (beacons: BeaconNetworkQueryState['beacons']) => {
  const overview: DiscoveryResults = {
    individualCount: 0,
    biosampleCount: 0,
    experimentCount: 0,
    biosampleChartData: [],
    experimentChartData: [],
  };

  Object.values(beacons).forEach(({ results }) => {
    overview.individualCount += results.individualCount ?? 0;
    overview.biosampleCount += results.experimentCount ?? 0;
    overview.experimentCount += results.experimentCount ?? 0;
    overview.biosampleChartData = mergeCharts(overview.biosampleChartData, results.biosampleChartData ?? []);
    overview.experimentChartData = mergeCharts(overview.experimentChartData, results.experimentChartData ?? []);
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
      const beaconId = action.meta.arg._beaconId;
      state.beacons[beaconId] = {
        apiErrorMessage: '',
        isFetchingQueryResponse: true,
        results: {},
      };

      // don't undo "responding" status if another beacon is already responding
      if (state.networkResponseStatus == 'idle') {
        state.networkResponseStatus = 'waiting';
      }
    });
    builder.addCase(queryBeaconNetworkNode.fulfilled, (state, action) => {
      const beaconId = action.meta.arg._beaconId;
      const { payload } = action;
      const hasErrorResponse = 'error' in payload;
      state.beacons[beaconId] = {
        apiErrorMessage: hasErrorResponse ? errorMsgOrDefault(payload.error?.errorMessage) : '',
        isFetchingQueryResponse: false,
        results: {
          // Bento-specific counts/chart data
          ...(payload.info?.bento
            ? {
                biosampleCount: payload.info.bento?.biosamples?.count,
                biosampleChartData: serializeChartData(payload.info.bento?.biosamples?.sampled_tissue),
                experimentCount: payload.info.bento?.experiments?.count,
                experimentChartData: serializeChartData(payload.info.bento?.experiments?.experiment_type),
              }
            : {}),

          // Beacon-standard individuals count
          ...(payload.responseSummary
            ? {
                individualCount: payload.responseSummary.numTotalResults,
              }
            : {}),
        },
      };
      state.networkResponseStatus = 'responding';
      state.networkResults = computeNetworkResults(state.beacons);
    });
    builder.addCase(queryBeaconNetworkNode.rejected, (state, action) => {
      const beaconId = action.meta.arg._beaconId;
      state.beacons[beaconId] = {
        apiErrorMessage: errorMsgOrDefault(action.payload), // passed from rejectWithValue
        isFetchingQueryResponse: false,
        results: {},
      };
      state.networkResponseStatus = 'responding';
    });
  },
});

export default queryBeaconNetworkNodeSlice.reducer;
