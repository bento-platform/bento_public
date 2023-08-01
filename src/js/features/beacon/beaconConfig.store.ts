import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BeaconConfigResponse, BeaconAssemblyIds } from '@/types/beacon';
import { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';

export const getBeaconConfig = createAsyncThunk<BeaconConfigResponse, void, { state: RootState; rejectValue: string }>(
  'beaconConfig/getBeaconConfig',
  (_, { getState, rejectWithValue }) => {
    const beaconInfoEndpoint = getState()?.config?.beaconUrl + '/info';
    return axios
      .get(beaconInfoEndpoint)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  }
);

type BeaconConfigInitialStateType = {
  isFetchingBeaconConfig: boolean;
  beaconAssemblyIds: BeaconAssemblyIds;
};

const initialState: BeaconConfigInitialStateType = {
  isFetchingBeaconConfig: false,
  beaconAssemblyIds: [],
};

const beaconConfig = createSlice({
  name: 'beaconConfig',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBeaconConfig.pending, (state) => {
      state.isFetchingBeaconConfig = true;
    });
    builder.addCase(getBeaconConfig.fulfilled, (state, { payload }) => {
      state.beaconAssemblyIds = Object.keys(payload.response?.overview?.counts?.variants ?? []);
      state.isFetchingBeaconConfig = false;
    });
    builder.addCase(getBeaconConfig.rejected, (state) => {
      state.isFetchingBeaconConfig = false;
    });
  },
});

export default beaconConfig.reducer;
