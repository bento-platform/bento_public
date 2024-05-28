import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { serializeChartData } from '@/utils/chart';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload } from '@/types/beacon';
import { BeaconNetworkAggregatedResponse, BeaconNetworkConfig } from '@/types/beaconNetwork';
import { ChartData } from '@/types/data';
import { BEACON_URL } from '@/config';

// temp, should be passed in from somewhere else
const BEACON_NETWORK_ROOT = 'https://bentov2.local/api/beacon/network/';

// network config currently just a list of beacons in the network with info about each one

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
  networkBeacons: BeaconNetworkConfig;
};

const initialState: beaconNetworkIntitalStateType = {
  isFetchingBeaconNetworkConfig: false,
  hasBeaconNetworkError: false,
  networkBeacons: {},
};

const beaconNetwork = createSlice({
  name: 'beaconNetwork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBeaconNetworkConfig.pending, (state) => {
      console.log('getBeaconNetworkConfig.pending');
      state.isFetchingBeaconNetworkConfig = true;
    });
    builder.addCase(getBeaconNetworkConfig.fulfilled, (state, { payload }) => {
      console.log('getBeaconNetworkConfig.fulfilled');
      state.isFetchingBeaconNetworkConfig = false;
      state.networkBeacons = payload;
    });
    builder.addCase(getBeaconNetworkConfig.rejected, (state, { payload }) => {
      state.isFetchingBeaconNetworkConfig = false;
      state.hasBeaconNetworkError = true;
      console.log('getBeaconNetworkConfig.rejected');
    });
  },
});

export default beaconNetwork.reducer;
