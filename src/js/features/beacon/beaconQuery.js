import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error.util.ts';

export const makeBeaconQuery = createAsyncThunk('beaconQuery/makeBeaconQuery', async (payload, { getState }) => {
  const beaconIndividualsEndpoint = getState()?.config?.beaconUrl + '/individuals';
  return axios
    .post(beaconIndividualsEndpoint, payload)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetchingQueryResponse: false,
  response: {},
};

const beaconQuery = createSlice({
  name: 'beaconQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeBeaconQuery.pending, (state) => {
      state.isFetchingQueryResponse = true;
    });
    builder.addCase(makeBeaconQuery.fulfilled, (state, { payload }) => {
      state.response = payload;
      state.isFetchingQueryResponse = false;
    });
    builder.addCase(makeBeaconQuery.rejected, (state) => {
      state.isFetchingQueryResponse = false;
    });
  },
});

export default beaconQuery.reducer;
