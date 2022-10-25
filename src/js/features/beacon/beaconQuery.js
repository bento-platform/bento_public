import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { printAPIError } from '../../utils/error';



// temp url, should go in client.env
const BEACON_INDIVIDUALS = "https://bentov2.local/api/beacon/individuals"

export const makeBeaconQuery = createAsyncThunk('beaconQuery/makeBeaconQuery', async (payload) => {
  return axios
    .post(BEACON_INDIVIDUALS, payload)
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
