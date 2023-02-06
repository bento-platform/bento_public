import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { configUrl } from '../../constants/configConstants';
import { printAPIError } from '../../utils/error';

export const makeGetConfigRequest = createAsyncThunk('config/getConfigData', async () => {
  return axios
    .get(configUrl)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetchingConfig: false,
  clientName: '',
  portalUrl: '',
  maxQueryParameters: 0,
  translated: false,
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
      state.clientName = payload.clientName;
      state.portalUrl = payload.portalUrl;
      state.maxQueryParameters = payload.maxQueryParameters;
      state.translated = payload.translated;
      state.isFetchingConfig = false;
    },
    [makeGetConfigRequest.rejected]: (state) => {
      state.isFetchingConfig = false;
    },
  },
});

export default config.reducer;
