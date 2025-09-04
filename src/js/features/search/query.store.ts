import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { BentoEntity, ResultsDataEntity } from '@/types/entities';
import { RequestStatus } from '@/types/requests';
// import { EMPTY_DISCOVERY_RESULTS } from '@/features/search/constants';
import type { CountsOrBooleans, DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
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
import type { Sections } from '@/types/data';
// import { serializeChartData } from '@/utils/chart';

import { discoveryChartProcessingAndLocalStorage } from './discoveryChartProcessingAndLocalStorage';
import { performKatsuDiscovery } from './performKatsuDiscovery.thunk';
import { fetchSearchFields } from './fetchSearchFields.thunk';
import { performFreeTextSearch } from './performFreeTextSearch.thunk';
import { fetchDiscoveryMatches } from './fetchDiscoveryMatches.thunk';

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
  defaultLayout: Sections;
  sections: Sections;
  // -------------------------------------
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

const INITIAL_MATCH_DATA_STATE = {
  status: RequestStatus.Idle,
  page: 0,
  totalMatches: 0,
  matches: undefined,
};

const initialState: QueryState = {
  defaultLayout: [],
  sections: [],
  // -------------------------------------
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
  resultCountsOrBools: {
    phenopacket: 0,
    individual: 0,
    biosample: 0,
    experiment: 0,
    experiment_result: 0,
  },
  pageSize: 10,
  matchData: {
    phenopacket: INITIAL_MATCH_DATA_STATE,
    biosample: INITIAL_MATCH_DATA_STATE,
    experiment: INITIAL_MATCH_DATA_STATE,
    experiment_result: INITIAL_MATCH_DATA_STATE,
  },
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    rearrange: (state, { payload }: PayloadAction<{ section: string; arrangement: string[] }>) => {
      const { section, arrangement } = payload;
      const sectionObj = state.sections.find((e) => e.sectionTitle === section)!;
      const chartsCopy = [...sectionObj.charts];
      sectionObj.charts = arrangement.map((e) => chartsCopy.find((i) => e === i.id)!);
    },
    disableChart: (state, { payload }: PayloadAction<{ section: string; id: string }>) => {
      const { section, id } = payload;
      state.sections.find((e) => e.sectionTitle === section)!.charts.find((e) => e.id === id)!.isDisplayed = false;
    },
    setDisplayedCharts: (state, { payload }: PayloadAction<{ section: string; charts: string[] }>) => {
      const { section, charts } = payload;
      state.sections
        .find((e) => e.sectionTitle === section)!
        .charts.forEach((val, ind, arr) => {
          arr[ind].isDisplayed = charts.includes(val.id);
        });
    },
    setChartWidth: (state, { payload }: PayloadAction<{ section: string; chart: string; width: number }>) => {
      const { section, chart, width } = payload;
      const chartObj = state.sections.find((e) => e.sectionTitle === section)!.charts.find((c) => c.id === chart)!;
      chartObj.width = width;
    },
    setAllDisplayedCharts: (state, { payload }: PayloadAction<{ section?: string }>) => {
      if (payload.section) {
        state.sections
          .find((e) => e.sectionTitle === payload.section)!
          .charts.forEach((_, ind, arr) => {
            arr[ind].isDisplayed = true;
          });
      } else {
        state.sections.forEach((section) => {
          section.charts.forEach((_val, ind, arr) => {
            arr[ind].isDisplayed = true;
          });
        });
      }
    },
    hideAllSectionCharts: (state, { payload }: PayloadAction<{ section: string }>) => {
      state.sections
        .find((e) => e.sectionTitle === payload.section)!
        .charts.forEach((_, ind, arr) => {
          arr[ind].isDisplayed = false;
        });
    },
    resetLayout: (state) => {
      state.sections = state.defaultLayout;
    },
    // -----------------------------------------------------------------------------------------------------------------
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
      (state, { payload: [scope, response] }: PayloadAction<[DiscoveryScope, DiscoveryResponseOrMessage]>) => {
        state.filterQueryStatus = RequestStatus.Fulfilled;
        if (response && 'message' in response && response.message) {
          state.message = response.message;
          return;
        }
        state.message = '';

        if (!response) return;

        if ('counts' in response) {
          state.resultCountsOrBools = response.counts;

          // Side effects: saving/loading layout from local storage
          const { defaultLayout, sectionData } = discoveryChartProcessingAndLocalStorage(scope, response);
          state.defaultLayout = defaultLayout;
          state.sections = sectionData;
        }
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
  rearrange,
  disableChart,
  setDisplayedCharts,
  setChartWidth,
  setAllDisplayedCharts,
  hideAllSectionCharts,
  resetLayout,
  // ------------------------------------------------------------------
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
