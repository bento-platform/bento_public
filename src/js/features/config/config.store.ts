import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { configUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ConfigResponse } from '@/types/configResponse';
import { ServiceInfoStore, ServicesResponse } from '@/types/services';
import { RootState } from '@/store';

export const makeGetConfigRequest = createAsyncThunk<ConfigResponse, void, { rejectValue: string }>(
  'config/getConfigData',
  (_, { rejectWithValue }) =>
    axios
      .get(configUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export const makeGetServiceInfoRequest = createAsyncThunk<ServicesResponse[], void, { state: RootState, rejectValue: string }>(
  'config/getServiceInfo',
  (_, { getState, rejectWithValue }) =>
    axios
      .get(`${getState()?.config?.publicUrl}/api/service-registry/services`)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export interface ConfigState extends ConfigResponse {
  publicUrlNoTrailingSlash: string,
  authCallbackUrl: string,
  isFetchingConfig: boolean;
  isFetchingServiceInfo: boolean;
  serviceInfo: ServiceInfoStore;
  maxQueryParametersRequired: boolean;
}

const initialState: ConfigState = {
  isFetchingConfig: false,
  clientName: '',
  portalUrl: '',
  maxQueryParameters: 0,
  maxQueryParametersRequired: true,
  translated: false,
  beaconUrl: '',
  beaconUiEnabled: false,
  publicUrl: '',
  publicUrlNoTrailingSlash: '',
  clientId: '',
  openIdConfigUrl: '',
  authCallbackUrl: '',
  isFetchingServiceInfo: false,
  serviceInfo: {
    auth: '',
  },
};

const configStore = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setMaxQueryParametersRequired: (state, { payload }: PayloadAction<boolean>) => {
      state.maxQueryParametersRequired = payload;
    },
  },
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

      const publicUrlNoTrailingSlash = payload.publicUrl.replace(/\/$/g, '');
      state.publicUrl = payload.publicUrl;
      state.publicUrlNoTrailingSlash = publicUrlNoTrailingSlash;
      state.authCallbackUrl = `${publicUrlNoTrailingSlash}/#/callback`;
      state.clientId = payload.clientId;
      state.openIdConfigUrl = payload.openIdConfigUrl;

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

export const { setMaxQueryParametersRequired } = configStore.actions;
export default configStore.reducer;
