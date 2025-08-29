import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { BentoEntity, ResultsDataEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
// import { EMPTY_DISCOVERY_RESULTS } from '@/features/search/constants';
import type { CountsOrBooleans, DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type {
  QueryParams,
  SearchFieldResponse,
  QueryMode,
  DiscoveryMatchObject,
  DiscoveryMatchPhenopacket,
  DiscoveryMatchBiosample,
  DiscoveryMatchExperiment,
  DiscoveryMatchExperimentResult,
} from '@/features/search/types';
// import { serializeChartData } from '@/utils/chart';

import { performKatsuDiscovery } from './performKatsuDiscovery.thunk';
import { fetchSearchFields } from './fetchSearchFields.thunk';
import { performFreeTextSearch } from '@/features/search/performFreeTextSearch.thunk';
import { fetchDiscoveryMatches } from '@/features/search/fetchDiscoveryMatches.thunk';

export type QueryResultMatchData<T extends DiscoveryMatchObject> = {
  status: RequestStatus;
  page: number;
  totalMatches: number;
  matches: T[] | undefined; // TODO
};

export const bentoEntityToResultsDataEntity = (x: BentoEntity): ResultsDataEntity => {
  if (x === 'variant') throw new Error('cannot currently handle variant results');
  return x === 'individual' ? 'phenopacket' : x;
};

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

  entity: BentoEntity | null;

  // results
  resultCountsOrBools: CountsOrBooleans;
  pageSize: number;
  matchData: {
    phenopacket: QueryResultMatchData<DiscoveryMatchPhenopacket>;
    biosample: QueryResultMatchData<DiscoveryMatchBiosample>;
    experiment: QueryResultMatchData<DiscoveryMatchExperiment>;
    experiment_result: QueryResultMatchData<DiscoveryMatchExperimentResult>;
  };
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
  // ----
  entity: null,
  // ----
  resultCountsOrBools: { phenopacket: 0, individual: 0, biosample: 0, experiment: 0, experiment_result: 0 },
  pageSize: 10,
  matchData: {
    phenopacket: {
      status: RequestStatus.Idle,
      page: 0,
      totalMatches: 0,
      matches: undefined,
    },
    biosample: {
      status: RequestStatus.Idle,
      page: 0,
      totalMatches: 0,
      matches: undefined,
    },
    experiment: {
      status: RequestStatus.Idle,
      page: 0,
      totalMatches: 0,
      matches: undefined,
    },
    experiment_result: {
      status: RequestStatus.Idle,
      page: 0,
      totalMatches: 0,
      matches: undefined,
    },
  },
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
    setEntity: (state, { payload }: PayloadAction<BentoEntity | null>) => {
      state.entity = payload;
    },
    setMatchesPage: (state, { payload }: PayloadAction<[BentoEntity, number]>) => {
      state.matchData[bentoEntityToResultsDataEntity(payload[0])].page = payload[1];
    },
    setMatchesPageSize: (state, { payload }: PayloadAction<number>) => {
      state.pageSize = payload;
    },
    resetAllQueryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(performKatsuDiscovery.pending, (state) => {
      state.filterQueryStatus = RequestStatus.Pending;
    });
    builder.addCase(
      performKatsuDiscovery.fulfilled,
      (state, { payload }: PayloadAction<DiscoveryResponseOrMessage>) => {
        state.filterQueryStatus = RequestStatus.Fulfilled;
        if (payload && 'message' in payload) {
          state.message = payload.message;
          return;
        }
        state.message = '';
        state.resultCountsOrBools = payload.counts;
        // {
        //   resultCountsOrBools: payload.counts;
        //   // biosampleChartData: serializeChartData(payload.biosamples.sampled_tissue),
        //   // experimentChartData: serializeChartData(payload.experiments.experiment_type),
        //   // individualMatches: payload.matches_detail, // Undefined if no permissions
        // };
      }
    );
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
      state.resultCountsOrBools = {
        phenopacket: payload.results.length,
        individual: payload.results.length,
        biosample: payload.results.reduce((acc, x) => acc + x.biosamples.length, 0),
        experiment: payload.results.reduce((acc, x) => acc + x.num_experiments, 0),
        experiment_result: 0, // TODO
      };
      // state.results = {
      //   // biosamples
      //   biosampleCount: payload.results.reduce((acc, x) => acc + x.biosamples.length, 0),
      //   biosampleChartData: [], // TODO
      //   // experiments
      //   experimentCount: payload.results.reduce((acc, x) => acc + x.num_experiments, 0),
      //   experimentChartData: [], // TODO
      //   // individuals
      //   individualCount: payload.results.length,
      //   individualMatches: payload.results.map(({ subject_id: id, phenopacket_id, dataset_id, project_id }) => ({
      //     id,
      //     phenopacket_id,
      //     dataset_id,
      //     project_id,
      //   })),
      // };
    });
    builder.addCase(performFreeTextSearch.rejected, (state) => {
      state.textQueryStatus = RequestStatus.Rejected;
    });
    // -----
    builder.addCase(fetchSearchFields.pending, (state) => {
      state.fieldsStatus = RequestStatus.Pending;
    });
    builder.addCase(fetchSearchFields.fulfilled, (state, { payload }) => {
      state.fieldsStatus = RequestStatus.Fulfilled;
      state.filterSections = payload.sections;
    });
    builder.addCase(fetchSearchFields.rejected, (state) => {
      state.fieldsStatus = RequestStatus.Rejected;
    });
    // -----
    builder.addCase(fetchDiscoveryMatches.pending, (state, { meta }) => {
      state.matchData[bentoEntityToResultsDataEntity(meta.arg)].status = RequestStatus.Pending;
    });
    builder.addCase(fetchDiscoveryMatches.fulfilled, (state, { meta, payload }) => {
      const entity: ResultsDataEntity = bentoEntityToResultsDataEntity(meta.arg);
      state.matchData[entity].status = RequestStatus.Fulfilled;
      state.matchData[entity].matches = payload.results;
      state.matchData[entity].totalMatches = payload.pagination.total;
    });
    builder.addCase(fetchDiscoveryMatches.rejected, (state, { meta }) => {
      state.matchData[bentoEntityToResultsDataEntity(meta.arg)].status = RequestStatus.Rejected;
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
  setMatchesPage,
  setMatchesPageSize,
  resetAllQueryState,
} = query.actions;
export { performKatsuDiscovery, fetchSearchFields };
export default query.reducer;
