import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import type { RootState } from '@/store';
import { beaconApiError } from '@/utils/beaconApiError';
import type { Section } from '@/types/search';
import type { BeaconAssemblyIds } from '@/types/beacon';
import type { NetworkBeacon, BeaconNetworkConfig } from '@/types/beaconNetwork';
import { BEACON_NETWORK_URL } from '@/config';

// network config currently just a list of beacons in the network with info about each one
// should probably add more details (eg version for whatever beacon is hosting the network)

export const getBeaconNetworkConfig = createAsyncThunk<
  BeaconNetworkConfig,
  void,
  { state: RootState; rejectValue: string }
>('beaconConfig/getBeaconNetworkConfig', (_, { rejectWithValue }) => {
  return axios
    .get(BEACON_NETWORK_URL)
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type BeaconNetworkConfigState = {
  isFetchingBeaconNetworkConfig: boolean;
  hasBeaconNetworkError: boolean;
  assemblyIds: BeaconAssemblyIds;
  querySectionsUnion: Section[];
  querySectionsIntersection: Section[];
  isQuerySectionsUnion: boolean; // horrible English
  currentQuerySections: Section[];
  beacons: NetworkBeacon[];
};

const initialState: BeaconNetworkConfigState = {
  isFetchingBeaconNetworkConfig: false,
  hasBeaconNetworkError: false,
  querySectionsUnion: [],
  querySectionsIntersection: [],
  isQuerySectionsUnion: true,
  currentQuerySections: [],
  assemblyIds: [],
  beacons: [],
};

const networkAssemblyIds = (beacons: NetworkBeacon[]) => {
  // reduce to list of assemblies
  // could probably do this in backend instead
  const assemblyIds = beacons.reduce(
    (assemblies: BeaconAssemblyIds, b: NetworkBeacon) => [...assemblies, ...Object.keys(b.overview?.variants ?? {})],
    []
  );
  // return unique values only
  return [...new Set(assemblyIds)];
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
  },
});

export const { toggleQuerySectionsUnionOrIntersection } = beaconNetwork.actions;
export default beaconNetwork.reducer;
