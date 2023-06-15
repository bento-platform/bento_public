import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { configUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ConfigResponse } from '@/types/configResponse';

export const makeGetConfigRequest = createAsyncThunk<ConfigResponse, void, { rejectValue: string }>(
  'config/getConfigData',
  (_, { rejectWithValue }) =>
    axios
      .get(configUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export interface ConfigState extends ConfigResponse {
  isFetchingConfig: boolean;
}

const initialState: ConfigState = {
  isFetchingConfig: false,
  clientName: '',
  portalUrl: '',
  maxQueryParameters: 0,
  translated: false,
  beaconUrl: '',
  beaconUiEnabled: false,
};

const configStore = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetConfigRequest.pending, (state) => {
      state.isFetchingConfig = true;
    });
    builder.addCase(makeGetConfigRequest.fulfilled, (state, { payload }: PayloadAction<ConfigResponse>) => {
      state.clientName = payload.clientName;
      state.portalUrl = payload.portalUrl;
      state.maxQueryParameters = payload.maxQueryParameters;
      state.translated = payload.translated;
      state.isFetchingConfig = false;
      state.beaconUrl = payload.beaconUrl;
      state.beaconUiEnabled = payload.beaconUiEnabled;
      state.isFetchingConfig = false;
    });
    builder.addCase(makeGetConfigRequest.rejected, (state) => {
      state.isFetchingConfig = false;
    });
  },
});

export default configStore.reducer;
