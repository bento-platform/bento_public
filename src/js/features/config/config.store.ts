import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuPublicOverviewUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ServiceInfoStore, ServicesResponse } from '@/types/services';
import { RootState } from '@/store';
import { PUBLIC_URL } from '@/config';
import { KatsuPublicOverviewResponse } from '@/types/configResponse';

export const makeGetConfigRequest = createAsyncThunk<KatsuPublicOverviewResponse, void, { rejectValue: string }>(
  'config/getConfigData',
  (_, { rejectWithValue }) =>
    axios
      .get(katsuPublicOverviewUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export const makeGetServiceInfoRequest = createAsyncThunk<
  ServicesResponse[],
  void,
  { state: RootState; rejectValue: string }
>('config/getServiceInfo', (_, { rejectWithValue }) =>
  axios
    .get(`${PUBLIC_URL}/api/service-registry/services`)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue))
);

export interface ConfigState {
  maxQueryParameters: number;
  isFetchingConfig: boolean;
  isFetchingServiceInfo: boolean;
  serviceInfo: ServiceInfoStore;
  maxQueryParametersRequired: boolean;
}

const initialState: ConfigState = {
  isFetchingConfig: false,
  maxQueryParameters: 0,
  maxQueryParametersRequired: true,
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
    builder.addCase(
      makeGetConfigRequest.fulfilled,
      (state, { payload }: PayloadAction<KatsuPublicOverviewResponse>) => {
        state.maxQueryParameters = payload.max_query_parameters;
        state.isFetchingConfig = false;
      }
    );
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
