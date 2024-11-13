import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PUBLIC_URL } from '@/config';
import { katsuPublicRulesUrl } from '@/constants/configConstants';
import type { ServiceInfoStore, ServicesResponse } from '@/types/services';
import type { RootState } from '@/store';
import type { DiscoveryRules } from '@/types/configResponse';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import { RequestStatus } from '@/types/requests';

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
        state.config.configStatus !== RequestStatus.Pending &&
        (state.config.configStatus === RequestStatus.Idle || state.config.configIsInvalid)
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
      return getState().config.serviceInfoStatus === RequestStatus.Idle;
    },
  }
);

export interface ConfigState {
  configStatus: RequestStatus;
  configIsInvalid: boolean;
  maxQueryParameters: number;
  maxQueryParametersRequired: boolean;
  // ----------------------------------------------------
  serviceInfoStatus: RequestStatus;
  serviceInfo: ServiceInfoStore;
}

const initialState: ConfigState = {
  configStatus: RequestStatus.Idle,
  configIsInvalid: false,
  maxQueryParameters: 0,
  maxQueryParametersRequired: true,
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
    setMaxQueryParametersRequired: (state, { payload }: PayloadAction<boolean>) => {
      state.maxQueryParametersRequired = payload;
    },
    invalidateConfig: (state) => {
      state.configIsInvalid = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetConfigRequest.pending, (state) => {
      state.configStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetConfigRequest.fulfilled, (state, { payload }: PayloadAction<DiscoveryRules>) => {
      state.maxQueryParameters = payload.max_query_parameters;
      state.configStatus = RequestStatus.Fulfilled;
      state.configIsInvalid = false;
    });
    builder.addCase(makeGetConfigRequest.rejected, (state) => {
      state.configStatus = RequestStatus.Rejected;
    });
    // ----------------------------------------------------
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

export const { setMaxQueryParametersRequired, invalidateConfig } = configStore.actions;
export default configStore.reducer;
