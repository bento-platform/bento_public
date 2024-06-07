import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconAssemblyIds } from '@/types/beacon';
import { NetworkBeacon, BeaconNetworkConfig } from '@/types/beaconNetwork';
import { BEACON_NETWORK_ROOT } from '@/constants/beaconConstants';

// network config currently just a list of beacons in the network with info about each one
// should probably add more details (eg version for whatever beacon is hosting the network)

export const getBeaconNetworkConfig = createAsyncThunk<
  BeaconNetworkConfig,
  void,
  { state: RootState; rejectValue: string }
>('beaconConfig/getBeaconNetworkConfig', (_, { rejectWithValue }) => {
  return axios
    .get(BEACON_NETWORK_ROOT)
    .then((res) => res.data)
    .catch(beaconApiError(rejectWithValue));
});

type beaconNetworkIntitalStateType = {
  isFetchingBeaconNetworkConfig: boolean;
  hasBeaconNetworkError: boolean;
  assemblyIds: BeaconAssemblyIds;
  querySectionsUnion: any;
  querySectionsIntersection: any;
  isQuerySectionsUnion: boolean; // horrible English
  currentQuerySections: any;
  beacons: NetworkBeacon[];
};

const initialState: beaconNetworkIntitalStateType = {
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
    builder.addCase(getBeaconNetworkConfig.pending, (state, action) => {
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
    builder.addCase(getBeaconNetworkConfig.rejected, (state, { payload }) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.hasBeaconNetworkError = true;
    });
  },
});

export const { toggleQuerySectionsUnionOrIntersection } = beaconNetwork.actions;
export default beaconNetwork.reducer;
