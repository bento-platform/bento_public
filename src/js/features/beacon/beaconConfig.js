import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error.util.ts';

export const getBeaconConfig = createAsyncThunk('beaconConfig/getBeaconConfig', async (_, { getState }) => {
  const beaconInfoEndpoint = getState()?.config?.beaconUrl + '/info';
  return axios
    .get(beaconInfoEndpoint)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetchingBeaconConfig: false,
  config: {},
};

const beaconConfig = createSlice({
  name: 'beaconConfig',
  initialState,
  reducers: {},
  extraReducers: {
    [getBeaconConfig.pending]: (state) => {
      state.isFetchingBeaconConfig = true;
    },
    [getBeaconConfig.fulfilled]: (state, { payload }) => {
      state.config = payload?.response;
      state.isFetchingBeaconConfig = false;
    },
    [getBeaconConfig.rejected]: (state) => {
      state.isFetchingBeaconConfig = false;
    },
  },
});

export default beaconConfig.reducer;
