import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import type { DiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';
import type { KatsuSearchResponse, SearchFieldResponse } from '@/types/search';
import { serializeChartData } from '@/utils/chart';

import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';

export type QueryState = {
  isFetchingFields: boolean;
  attemptedFieldsFetch: boolean;
  fieldsStatus: RequestStatus;
  dataStatus: RequestStatus;
  querySections: SearchFieldResponse['sections'];
  queryParams: { [key: string]: string };
  queryParamCount: number;
  message: string;
  results: DiscoveryResults;
};

const initialState: QueryState = {
  isFetchingFields: false,
  attemptedFieldsFetch: false,
  fieldsStatus: RequestStatus.Idle,
  dataStatus: RequestStatus.Idle,
  message: '',
  querySections: [],
  queryParams: {},
  queryParamCount: 0,
  results: EMPTY_DISCOVERY_RESULTS,
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryParams: (state, { payload }) => {
      state.queryParams = payload;
      state.queryParamCount = Object.keys(payload).length;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetKatsuPublic.pending, (state) => {
      state.dataStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetKatsuPublic.fulfilled, (state, { payload }: PayloadAction<KatsuSearchResponse>) => {
      state.dataStatus = RequestStatus.Fulfilled;
      if (payload && 'message' in payload) {
        state.message = payload.message;
        return;
      }
      state.message = '';
      state.results = {
        // biosamples
        biosampleCount: payload.biosamples.count,
        biosampleChartData: serializeChartData(payload.biosamples.sampled_tissue),
        // experiments
        experimentCount: payload.experiments.count,
        experimentChartData: serializeChartData(payload.experiments.experiment_type),
        // individuals
        individualCount: payload.count,
        individualMatches: payload.matches, // Undefined if no permissions
      };
    });
    builder.addCase(makeGetKatsuPublic.rejected, (state) => {
      state.dataStatus = RequestStatus.Rejected;
    });
    builder.addCase(makeGetSearchFields.pending, (state) => {
      state.fieldsStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetSearchFields.fulfilled, (state, { payload }) => {
      state.fieldsStatus = RequestStatus.Fulfilled;
      state.querySections = payload.sections;
    });
    builder.addCase(makeGetSearchFields.rejected, (state) => {
      state.fieldsStatus = RequestStatus.Rejected;
    });
  },
});

export const { setQueryParams } = query.actions;
export { makeGetKatsuPublic, makeGetSearchFields };
export default query.reducer;
