import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PUBLIC_URL } from '@/config';
import { katsuPublicRulesUrl } from '@/constants/configConstants';
import type { ServiceInfoStore, ServicesResponse } from '@/types/services';
import type { RootState } from '@/store';
import type { DiscoveryRules } from '@/types/configResponse';
import { RequestStatus } from '@/types/requests';
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
      const {
        config: { configStatus, configIsInvalid },
        metadata: {
          selectedScope: { scopeSet },
        },
      } = getState();
      const cond =
        scopeSet && configStatus !== RequestStatus.Pending && (configStatus === RequestStatus.Idle || configIsInvalid);
      if (!cond) {
        console.debug(
          `makeGetConfigRequest() was attempted, but will not dispatch:
            scopeSet=${scopeSet}, configStatus=${RequestStatus[configStatus]}, configIsInvalid=${configIsInvalid}`
        );
      }
      return cond;
    },
  }
);

export const makeGetServiceInfoRequest = createAsyncThunk<
  ServicesResponse[],
  void,
  { state: RootState; rejectValue: string }
>(
  'config/getServiceInfo',
  (_, { rejectWithValue }) =>
    axios
      .get(`${PUBLIC_URL}/api/service-registry/services`)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue)),
  {
    condition(_, { getState }) {
      const { serviceInfoStatus } = getState().config;
      const cond = serviceInfoStatus === RequestStatus.Idle;
      if (!cond) {
        console.debug(
          `makeGetServiceInfoRequest() was attempted, but a prior attempt gave status:` +
            RequestStatus[serviceInfoStatus]
        );
      }
      return cond;
    },
  }
);

export interface ConfigState {
  configStatus: RequestStatus;
  configIsInvalid: boolean;
  countThreshold: number;
  maxQueryParameters: number;
  // ----------------------------------------------------
  serviceInfoStatus: RequestStatus;
  serviceInfo: ServiceInfoStore;
}

const initialState: ConfigState = {
  configStatus: RequestStatus.Idle,
  configIsInvalid: false,
  countThreshold: 0,
  maxQueryParameters: 0,
  // ----------------------------------------------------
  serviceInfoStatus: RequestStatus.Idle,
  serviceInfo: {
    auth: '',
  },
};

const configStore = createSlice({
  name: 'config',
  initialState,
  reducers: {
    invalidateConfig: (state) => {
      state.configIsInvalid = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetConfigRequest.pending, (state) => {
      state.configStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetConfigRequest.fulfilled, (state, { payload }: PayloadAction<DiscoveryRules>) => {
      state.countThreshold = payload.count_threshold;
      state.maxQueryParameters = payload.max_query_parameters;
      state.configStatus = RequestStatus.Fulfilled;
      state.configIsInvalid = false;
    });
    builder.addCase(makeGetConfigRequest.rejected, (state) => {
      state.configStatus = RequestStatus.Rejected;
    });
    builder.addCase(makeGetServiceInfoRequest.pending, (state) => {
      state.serviceInfoStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetServiceInfoRequest.fulfilled, (state, { payload }: PayloadAction<ServicesResponse[]>) => {
      state.serviceInfo.auth = payload.find((service) => service.bento.serviceKind === 'authorization')?.url || '';
      state.serviceInfoStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetServiceInfoRequest.rejected, (state) => {
      state.serviceInfoStatus = RequestStatus.Rejected;
    });
  },
});

export const { invalidateConfig } = configStore.actions;
export default configStore.reducer;
