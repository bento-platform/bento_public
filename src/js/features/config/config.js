import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { configUrl } from '../../constants/configConstants';

export const makeGetConfigRequest = createAsyncThunk(
  'config/getConfigData',
  async () => {
    return axios
      .get(configUrl)
      .then((res) => res.data)
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  }
);

const initialState = {
  isFetchingConfig: false,
  portalUrl: '',
  maxQueryParameters: 0,
};

const config = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: {
    [makeGetConfigRequest.pending]: (state) => {
      state.isFetchingConfig = true;
    },
    [makeGetConfigRequest.fulfilled]: (state, { payload }) => {
      state.portalUrl = payload.portalUrl;
      state.maxQueryParameters = payload.maxQueryParameters;
      state.isFetchingConfig = false;
    },
    [makeGetConfigRequest.rejected]: (state) => {
      state.isFetchingConfig = false;
    },
  },
});

export default config.reducer;
