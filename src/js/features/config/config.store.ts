import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { configUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ConfigResponse } from '@/types/configResponse';
import { BENTO_URL } from '@/config';
import { ServiceInfoStore, ServicesResponse } from '@/types/services';

export const makeGetConfigRequest = createAsyncThunk<ConfigResponse, void, { rejectValue: string }>(
  'config/getConfigData',
  (_, { rejectWithValue }) =>
    axios
      .get(configUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export const makeGetServiceInfoRequest = createAsyncThunk<ServicesResponse[], void, { rejectValue: string }>(
  'config/getServiceInfo',
  (_, { rejectWithValue }) =>
    axios
      .get(`${BENTO_URL}/api/service-registry/services`)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export interface ConfigState extends ConfigResponse {
  isFetchingConfig: boolean;
  isFetchingServiceInfo: boolean;
  serviceInfo: ServiceInfoStore;
}

const initialState: ConfigState = {
  isFetchingConfig: false,
  clientName: '',
  portalUrl: '',
  maxQueryParameters: 0,
  translated: false,
  beaconUrl: '',
  beaconUiEnabled: false,
  isFetchingServiceInfo: false,
  serviceInfo: {
    auth: '',
  },
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
    builder.addCase(makeGetServiceInfoRequest.pending, (state) => {
      state.isFetchingServiceInfo = true;
    });
    builder.addCase(makeGetServiceInfoRequest.fulfilled, (state, { payload }: PayloadAction<ServicesResponse[]>) => {
      state.serviceInfo.auth = payload.find((service) => service.bento.serviceKind === 'authorization')?.url || '';
      state.isFetchingServiceInfo = false;
    });
    builder.addCase(makeGetServiceInfoRequest.rejected, (state) => {
      state.isFetchingServiceInfo = false;
    });
  },
});

export default configStore.reducer;
