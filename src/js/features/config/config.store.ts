import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PUBLIC_URL } from '@/config';
import { katsuPublicRulesUrl } from '@/constants/configConstants';
import type { ServiceInfoStore, ServicesResponse } from '@/types/services';
import type { RootState } from '@/store';
import type { DiscoveryRules } from '@/types/configResponse';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const makeGetConfigRequest = createAsyncThunk<DiscoveryRules, void, { rejectValue: string; state: RootState }>(
  'config/getConfigData',
  (_, { rejectWithValue, getState }) => {
    return axios
      .get(katsuPublicRulesUrl, scopedAuthorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const state = getState();
      return (
        state.metadata.selectedScope.scopeSet &&
        !state.config.isFetchingConfig &&
        (!state.config.hasAttemptedConfig || state.config.configIsInvalid)
      );
    },
  }
);

export const makeGetServiceInfoRequest = createAsyncThunk<
  ServicesResponse[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'config/getServiceInfo',
  (_, { rejectWithValue }) =>
    axios
      .get(`${PUBLIC_URL}/api/service-registry/services`)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue)),
  {
    condition(_, { getState }) {
      const state = getState();
      return !state.config.isFetchingServiceInfo && !state.config.hasAttemptedServiceInfo;
    },
  }
);

export interface ConfigState {
  isFetchingConfig: boolean;
  hasAttemptedConfig: boolean;
  configIsInvalid: boolean;
  maxQueryParameters: number;
  maxQueryParametersRequired: boolean;
  // ----------------------------------------------------
  isFetchingServiceInfo: boolean;
  hasAttemptedServiceInfo: boolean;
  serviceInfo: ServiceInfoStore;
}

const initialState: ConfigState = {
  isFetchingConfig: false,
  hasAttemptedConfig: false,
  configIsInvalid: false,
  maxQueryParameters: 0,
  maxQueryParametersRequired: true,
  // ----------------------------------------------------
  isFetchingServiceInfo: false,
  hasAttemptedServiceInfo: false,
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
    invalidateConfig: (state) => {
      state.configIsInvalid = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetConfigRequest.pending, (state) => {
      state.isFetchingConfig = true;
    });
    builder.addCase(makeGetConfigRequest.fulfilled, (state, { payload }: PayloadAction<DiscoveryRules>) => {
      state.maxQueryParameters = payload.max_query_parameters;
      state.isFetchingConfig = false;
      state.hasAttemptedConfig = true;
      state.configIsInvalid = false;
    });
    builder.addCase(makeGetConfigRequest.rejected, (state) => {
      state.isFetchingConfig = false;
      state.hasAttemptedConfig = true;
    });
    // ----------------------------------------------------
    builder.addCase(makeGetServiceInfoRequest.pending, (state) => {
      state.isFetchingServiceInfo = true;
    });
    builder.addCase(makeGetServiceInfoRequest.fulfilled, (state, { payload }: PayloadAction<ServicesResponse[]>) => {
      state.serviceInfo.auth = payload.find((service) => service.bento.serviceKind === 'authorization')?.url || '';
      state.isFetchingServiceInfo = false;
      state.hasAttemptedServiceInfo = true;
    });
    builder.addCase(makeGetServiceInfoRequest.rejected, (state) => {
      state.isFetchingServiceInfo = false;
      state.hasAttemptedServiceInfo = true;
    });
  },
});

export const { setMaxQueryParametersRequired, invalidateConfig } = configStore.actions;
export default configStore.reducer;
