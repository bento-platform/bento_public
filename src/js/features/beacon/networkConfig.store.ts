import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { beaconApiError } from '@/utils/beaconApiError';
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
  beacons: NetworkBeacon[];
};

const initialState: beaconNetworkIntitalStateType = {
  isFetchingBeaconNetworkConfig: false,
  hasBeaconNetworkError: false,
  beacons: [],
};

const beaconNetwork = createSlice({
  name: 'beaconNetwork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBeaconNetworkConfig.pending, (state, action) => {
      state.isFetchingBeaconNetworkConfig = true;
    });
    builder.addCase(getBeaconNetworkConfig.fulfilled, (state, { payload }) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.beacons = payload;
    });
    builder.addCase(getBeaconNetworkConfig.rejected, (state, { payload }) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.hasBeaconNetworkError = true;
    });
  },
});

export default beaconNetwork.reducer;
