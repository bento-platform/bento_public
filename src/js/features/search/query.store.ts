import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import type { DiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';
import type { KatsuSearchResponse, SearchFieldResponse } from '@/types/search';
import { serializeChartData } from '@/utils/chart';

import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';

export type QueryState = {
  fieldsStatus: RequestStatus;
  filterQueryStatus: RequestStatus;
  textQueryStatus: RequestStatus;
  // ----
  querySections: SearchFieldResponse['sections'];
  queryParams: { [key: string]: string };
  queryParamCount: number;
  message: string;
  results: DiscoveryResults;
};

const initialState: QueryState = {
  fieldsStatus: RequestStatus.Idle,
  filterQueryStatus: RequestStatus.Idle,
  textQueryStatus: RequestStatus.Idle,
  // ----
  querySections: [],
  queryParams: {},
  queryParamCount: 0,
  message: '',
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
      state.filterQueryStatus = RequestStatus.Pending;
    });
    builder.addCase(makeGetKatsuPublic.fulfilled, (state, { payload }: PayloadAction<KatsuSearchResponse>) => {
      state.filterQueryStatus = RequestStatus.Fulfilled;
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
      state.filterQueryStatus = RequestStatus.Rejected;
    });
    // -----
    builder.addCase(performFreeTextSearch.pending, (state) => {
      state.textQueryStatus = RequestStatus.Pending;
    });
    builder.addCase(performFreeTextSearch.fulfilled, (state, { payload }) => {
      state.textQueryStatus = RequestStatus.Fulfilled;
      state.message = '';
      state.results = {
        // biosamples
        biosampleCount: payload.results.reduce((acc, x) => acc + x.biosamples.length, 0),
        biosampleChartData: [], // TODO
        // experiments
        experimentCount: payload.results.reduce((acc, x) => acc + x.num_experiments, 0),
        experimentChartData: [], // TODO
        // individuals
        individualCount: payload.results.length,
        individualMatches: payload.results.map((r) => r.subject_id),
      };
    });
    builder.addCase(performFreeTextSearch.rejected, (state) => {
      state.textQueryStatus = RequestStatus.Rejected;
    });
    // -----
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
