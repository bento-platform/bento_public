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
  isFetching: false,
  response: {},
};

const beaconQuery = createSlice({
  name: 'beaconQuery',
  initialState,
  reducers: {},
  extraReducers: {
    [makeBeaconQuery.pending]: (state) => {
      state.isFetching = true;
    },
    [makeBeaconQuery.fulfilled]: (state, { payload }) => {
      console.log({beaconResponse: payload})
      state.response = payload
      state.isFetching = false;
    },
    [makeBeaconQuery.rejected]: (state) => {
      state.isFetching = false;
    },
  },
});

export default beaconQuery.reducer;
