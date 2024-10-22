import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';

import { BEACON_NETWORK_URL } from '@/config';
import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import { BEACON_INDIVIDUALS_PATH } from '@/features/beacon/constants';
import type {
  BeaconAssemblyIds,
  BeaconQueryPayload,
  BeaconQueryResponse,
  FlattenedBeaconResponse,
} from '@/types/beacon';
import type { NetworkBeacon, BeaconNetworkConfig, QueryToNetworkBeacon } from '@/types/beaconNetwork';
import type { AppDispatch, RootState } from '@/store';
import type { DiscoveryResults } from '@/types/data';
import type { Section } from '@/types/search';
import { beaconApiError, errorMsgOrDefault } from '@/utils/beaconApiError';

import { computeNetworkResults, extractBeaconDiscoveryOverview, networkAssemblyIds, networkQueryUrl } from './utils';

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = BEACON_INDIVIDUALS_PATH;

// network config currently just a list of beacons in the network with info about each one
// should probably add more details (e.g., version for whatever beacon is hosting the network)

export const getBeaconNetworkConfig = createAsyncThunk<
  BeaconNetworkConfig,
  void,
  { state: RootState; rejectValue: string }
>(
  'beaconNetwork/getBeaconNetworkConfig',
  (_, { rejectWithValue }) => {
    return axios
      .get(BEACON_NETWORK_URL)
      .then((res) => res.data)
      .catch(beaconApiError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return !getState().beaconNetwork.isFetchingBeaconNetworkConfig;
    },
  }
);

// dispatch a query for each beacon in the network
export const beaconNetworkQuery =
  (payload: BeaconQueryPayload) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { beacons } = getState().beaconNetwork;
    beacons.forEach((b) => {
      const url = networkQueryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
      dispatch(queryBeaconNetworkNode({ _beaconId: b.id, url: url, payload: payload }));
    });
  };

const queryBeaconNetworkNode = createAsyncThunk<
  BeaconQueryResponse,
  QueryToNetworkBeacon,
  { state: RootState; rejectValue: string }
>(
  'beaconNetwork/queryBeaconNetworkNode',
  async ({ url, payload }, { rejectWithValue }) => {
    // currently no auth in beacon network
    // these would only make sense if we start creating tokens that apply to more than one bento instance
    // const token = getState().auth.accessToken;
    // const headers = makeAuthorizationHeader(token);

    return axios
      .post(url, payload)
      .then((res) => res.data)
      .catch(beaconApiError(rejectWithValue));
  },
  {
    condition({ _beaconId }, { getState }) {
      return !(getState().beaconNetwork.beaconResponses[_beaconId]?.isFetchingQueryResponse ?? false);
    },
  }
);

type BeaconNetworkConfigState = {
  // config
  isFetchingBeaconNetworkConfig: boolean;
  hasBeaconNetworkError: boolean;
  assemblyIds: BeaconAssemblyIds;
  querySectionsUnion: Section[];
  querySectionsIntersection: Section[];
  isQuerySectionsUnion: boolean; // horrible English
  currentQuerySections: Section[];
  beacons: NetworkBeacon[];

  // querying
  networkResults: DiscoveryResults;
  beaconResponses: {
    [beaconId: string]: FlattenedBeaconResponse;
  };
};

const initialState: BeaconNetworkConfigState = {
  // config
  isFetchingBeaconNetworkConfig: false,
  hasBeaconNetworkError: false,
  querySectionsUnion: [],
  querySectionsIntersection: [],
  isQuerySectionsUnion: true,
  currentQuerySections: [],
  assemblyIds: [],
  beacons: [],

  // querying
  networkResults: EMPTY_DISCOVERY_RESULTS,
  beaconResponses: {},
};

const beaconNetwork = createSlice({
  name: 'beaconNetwork',
  initialState,
  reducers: {
    toggleQuerySectionsUnionOrIntersection(state) {
      // update, then set boolean
      state.currentQuerySections = state.isQuerySectionsUnion
        ? state.querySectionsIntersection
        : state.querySectionsUnion;
      state.isQuerySectionsUnion = !state.isQuerySectionsUnion;
    },
  },
  extraReducers: (builder) => {
    // config ----------------------------------------------------------------------------------------------------------
    builder.addCase(getBeaconNetworkConfig.pending, (state) => {
      state.isFetchingBeaconNetworkConfig = true;
    });
    builder.addCase(getBeaconNetworkConfig.fulfilled, (state, { payload }) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.beacons = payload.beacons;
      state.querySectionsUnion = payload.filtersUnion;
      state.querySectionsIntersection = payload.filtersIntersection;
      state.currentQuerySections = payload.filtersUnion;
      state.assemblyIds = networkAssemblyIds(payload.beacons);
    });
    builder.addCase(getBeaconNetworkConfig.rejected, (state) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.hasBeaconNetworkError = true;
    });

    // querying --------------------------------------------------------------------------------------------------------
    builder.addCase(queryBeaconNetworkNode.pending, (state, action) => {
      const beaconId = action.meta.arg._beaconId;
      state.beaconResponses[beaconId] = {
        apiErrorMessage: '',
        isFetchingQueryResponse: true,
        results: {},
      };
    });
    builder.addCase(queryBeaconNetworkNode.fulfilled, (state, action) => {
      const beaconId = action.meta.arg._beaconId;
      const { payload } = action;
      const hasErrorResponse = 'error' in payload;
      state.beaconResponses[beaconId] = {
        apiErrorMessage: hasErrorResponse ? errorMsgOrDefault(payload.error?.errorMessage) : '',
        isFetchingQueryResponse: false,
        results: extractBeaconDiscoveryOverview(payload),
      };
      state.networkResults = computeNetworkResults(state.beaconResponses);
    });
    builder.addCase(queryBeaconNetworkNode.rejected, (state, action) => {
      const beaconId = action.meta.arg._beaconId;
      state.beaconResponses[beaconId] = {
        apiErrorMessage: errorMsgOrDefault(action.payload), // passed from rejectWithValue
        isFetchingQueryResponse: false,
        results: {},
      };
    });
  },
});

export const { toggleQuerySectionsUnionOrIntersection } = beaconNetwork.actions;
export default beaconNetwork.reducer;
