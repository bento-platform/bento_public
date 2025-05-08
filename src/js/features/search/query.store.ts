import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { DiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';
import { EMPTY_DISCOVERY_RESULTS } from '@/features/search/constants';
import type { KatsuSearchResponse, QueryParams, SearchFieldResponse } from '@/features/search/types';
import { serializeChartData } from '@/utils/chart';

import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';

export type QueryState = {
  fieldsStatus: RequestStatus;
  filterQueryStatus: RequestStatus;
  textQueryStatus: RequestStatus;
  // ----
  filterSections: SearchFieldResponse['sections'];
  filterQueryParams: QueryParams;
  // ----
  textQuery: string;
  // ----
  message: string;
  results: DiscoveryResults;
};

const initialState: QueryState = {
  fieldsStatus: RequestStatus.Idle,
  filterQueryStatus: RequestStatus.Idle,
  textQueryStatus: RequestStatus.Idle,
  // ----
  filterSections: [],
  filterQueryParams: {},
  // ----
  textQuery: '',
  // ----
  message: '',
  results: EMPTY_DISCOVERY_RESULTS,
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setFilterQueryParams: (state, { payload }: PayloadAction<QueryParams>) => {
      state.filterQueryParams = payload;
    },
    resetFilterQueryStatus: (state) => {
      state.filterQueryStatus = RequestStatus.Idle;
    },
    setTextQuery: (state, { payload }: PayloadAction<string>) => {
      state.textQuery = payload;
    },
    resetTextQueryStatus: (state) => {
      state.textQueryStatus = RequestStatus.Idle;
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
        individualMatches: payload.matches_detail, // Undefined if no permissions
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
        individualMatches: payload.results.map(({ subject_id: id, phenopacket_id, dataset_id, project_id }) => ({
          id,
          phenopacket_id,
          dataset_id,
          project_id,
        })),
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
      state.filterSections = payload.sections;
    });
    builder.addCase(makeGetSearchFields.rejected, (state) => {
      state.fieldsStatus = RequestStatus.Rejected;
    });
  },
});

export const { setFilterQueryParams, resetFilterQueryStatus, setTextQuery, resetTextQueryStatus } = query.actions;
export { makeGetKatsuPublic, makeGetSearchFields };
export default query.reducer;
