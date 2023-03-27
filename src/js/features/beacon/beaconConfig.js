import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error';

export const getBeaconConfig = createAsyncThunk('beaconConfig/getBeaconConfig', async (_, { getState }) => {
  const beaconInfoEndpoint = getState()?.config?.beaconUrl + '/info';
  return axios
    .get(beaconInfoEndpoint)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetching: false,
  response: {},
};

const beaconConfig = createSlice({
  name: 'beaconConfig',
  initialState,
  reducers: {
    [getBeaconConfig.pending]: (state) => {
      state.isFetching = true;
    },
    [getBeaconConfig.fulfilled]: (state, { payload }) => {
      console.log({ beaconConfig: payload });
      state.response = payload;
      state.isFetching = false;
    },
    [getBeaconConfig.rejected]: (state) => {
      state.isFetching = false;
    },
  },
  extraReducers: {},
});

export default beaconConfig.reducer;
