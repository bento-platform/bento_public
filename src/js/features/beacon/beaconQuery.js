import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error';


export const makeBeaconQuery = createAsyncThunk('beaconQuery/makeBeaconQuery', async (payload, { getState }) => {
  const beaconIndividualsEndpoint = getState()?.config?.beaconUrl + '/individuals'
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
  extraReducers: {
    [makeBeaconQuery.pending]: (state) => {
      state.isFetchingQueryResponse = true;
    },
    [makeBeaconQuery.fulfilled]: (state, { payload }) => {
      console.log({beaconResponse: payload})
      state.response = payload
      state.isFetchingQueryResponse = false;
    },
    [makeBeaconQuery.rejected]: (state) => {
      state.isFetchingQueryResponse = false;
    },
  },
});

export default beaconQuery.reducer;
