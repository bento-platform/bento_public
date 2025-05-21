import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { DiscoveryResults } from '@/types/data';
import { RequestStatus } from '@/types/requests';
import { EMPTY_DISCOVERY_RESULTS } from '@/features/search/constants';
import type { KatsuSearchResponse, QueryParams, SearchFieldResponse, QueryMode } from '@/features/search/types';
import { serializeChartData } from '@/utils/chart';

import { performKatsuDiscovery } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';

export type QueryState = {
  mode: QueryMode;
  // ---
  fieldsStatus: RequestStatus;
  filterQueryStatus: RequestStatus;
  textQueryStatus: RequestStatus;
  // ----
  filterSections: SearchFieldResponse['sections'];
  filterQueryParams: QueryParams;
  // ----
  textQuery: string;
  // ----
  // Whether the first search has been executed; can't be reset on 'search mode' (filter/text) change the way
  // (filter|text)QueryStatus can. This is instead only reset when the complete query state is reset.
  doneFirstLoad: boolean;
  message: string;
  results: DiscoveryResults;
};

const initialState: QueryState = {
  mode: 'filters',
  // ---
  fieldsStatus: RequestStatus.Idle,
  filterQueryStatus: RequestStatus.Idle,
  textQueryStatus: RequestStatus.Idle,
  // ----
  filterSections: [],
  filterQueryParams: {},
  // ----
  textQuery: '',
  // ----
  doneFirstLoad: false,
  message: '',
  results: EMPTY_DISCOVERY_RESULTS,
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryMode: (state, { payload }: PayloadAction<QueryMode>) => {
      state.mode = payload;
    },
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
    setDoneFirstLoad: (state) => {
      state.doneFirstLoad = true;
    },
    resetAllQueryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(performKatsuDiscovery.pending, (state) => {
      state.filterQueryStatus = RequestStatus.Pending;
    });
    builder.addCase(performKatsuDiscovery.fulfilled, (state, { payload }: PayloadAction<KatsuSearchResponse>) => {
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
    builder.addCase(performKatsuDiscovery.rejected, (state) => {
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

export const {
  setQueryMode,
  setFilterQueryParams,
  resetFilterQueryStatus,
  setTextQuery,
  resetTextQueryStatus,
  setDoneFirstLoad,
  resetAllQueryState,
} = query.actions;
export { performKatsuDiscovery, makeGetSearchFields };
export default query.reducer;
