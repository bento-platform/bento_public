import type { Draft, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type {
  BentoCountEntity,
  BentoKatsuEntity,
  KatsuEntityCountsOrBooleans,
  ResultsDataEntity,
} from '@/types/entities';
import { RequestStatus } from '@/types/requests';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type {
  FtsQueryType,
  QueryParams,
  DefinedQueryParams,
  SearchFieldResponse,
  DiscoveryMatchObject,
  DiscoveryMatchPhenopacket,
  DiscoveryMatchBiosample,
  DiscoveryMatchExperiment,
  DiscoveryMatchExperimentResult,
  DiscoveryUIHints,
} from '@/features/search/types';
import type { Sections } from '@/types/data';

import { MIN_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/pagination';

import { discoveryChartProcessingAndLocalStorage } from './discoveryChartProcessingAndLocalStorage';
import { performKatsuDiscovery } from './performKatsuDiscovery.thunk';
import { fetchSearchFields } from './fetchSearchFields.thunk';
import { fetchDiscoveryMatches } from './fetchDiscoveryMatches.thunk';
import { fetchDiscoveryUIHints } from './fetchDiscoveryUIHints.thunk';
import { bentoKatsuEntityToResultsDataEntity, checkQueryParamsEqual } from './utils';
import { definedQueryParams } from '@/utils/requests';

export type QueryResultMatchData<T extends DiscoveryMatchObject> = {
  status: RequestStatus;
  page: number;
  totalMatches: number;
  matches: T[] | undefined;
  invalid: boolean;
};

export type QueryState = {
  defaultLayout: Sections;
  sections: Sections;
  // -------------------------------------
  fieldsStatus: RequestStatus;
  discoveryStatus: RequestStatus;
  // ----
  filterSections: SearchFieldResponse['sections'];
  filterQueryParams: DefinedQueryParams;
  // ----
  textQuery: string;
  textQueryType: FtsQueryType;
  // ----
  // Whether the first search has been executed; can't be reset on 'search mode' (filter/text) change the way
  // (filter|text)QueryStatus can. This is instead only reset when the complete query state is reset.
  doneFirstLoad: boolean;
  message: string;

  selectedEntity: BentoCountEntity | null;

  // results
  resultCountsOrBools: KatsuEntityCountsOrBooleans;
  resultCountsInvalid: boolean;
  pageSize: number;
  matchData: {
    phenopacket: QueryResultMatchData<DiscoveryMatchPhenopacket>;
    biosample: QueryResultMatchData<DiscoveryMatchBiosample>;
    experiment: QueryResultMatchData<DiscoveryMatchExperiment>;
    experiment_result: QueryResultMatchData<DiscoveryMatchExperimentResult>;
  };

  // UI hints
  uiHints: {
    status: RequestStatus;
    data: DiscoveryUIHints;
  };
};

const INITIAL_MATCH_DATA_STATE = {
  status: RequestStatus.Idle,
  page: 0,
  totalMatches: 0,
  matches: undefined,
  invalid: false,
};

const initialState: QueryState = {
  defaultLayout: [],
  sections: [],
  // -------------------------------------
  fieldsStatus: RequestStatus.Idle,
  discoveryStatus: RequestStatus.Idle,
  // ----
  filterSections: [],
  filterQueryParams: {},
  // ----
  textQuery: '',
  textQueryType: 'plain',
  // ----
  doneFirstLoad: false,
  message: '',
  // ----
  selectedEntity: null,
  // ----
  resultCountsOrBools: {
    phenopacket: 0,
    individual: 0,
    biosample: 0,
    experiment: 0,
    experiment_result: 0,
  },
  resultCountsInvalid: false,
  pageSize: MIN_PAGE_SIZE,
  matchData: {
    phenopacket: INITIAL_MATCH_DATA_STATE,
    biosample: INITIAL_MATCH_DATA_STATE,
    experiment: INITIAL_MATCH_DATA_STATE,
    experiment_result: INITIAL_MATCH_DATA_STATE,
  },
  // ----
  uiHints: {
    status: RequestStatus.Idle,
    data: {
      entities_with_data: [],
    },
  },
};

/**
 * Helper utility to invalidate all match data when a relevant parameter changes (and naturally invalidates the results,
 * which we need to reflect in the state in order to re-fetch.)
 * @param state - Draft of QueryState
 */
const invalidateMatchData = (state: Draft<QueryState>) => {
  Object.keys(state.matchData).forEach((e) => {
    const entity: ResultsDataEntity = e as ResultsDataEntity;
    if (state.matchData[entity].status === RequestStatus.Idle) return; // Not fetched yet, don't bother invalidating
    state.matchData[entity].invalid = true;
    if (e !== state.selectedEntity) {
      // For all not currently-visible pages, Redux is the source of truth rather than the URL, so reset the
      // current page upon invalidation:
      state.matchData[entity].page = 0;
    }
  });
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
    setFilterQueryParams: (state, { payload }: PayloadAction<QueryParams>) => {
      const definedQPs = definedQueryParams(payload);
      if (checkQueryParamsEqual(state.filterQueryParams, definedQPs)) return; // Don't update unnecessarily
      console.debug('setting filter query params', definedQPs);
      state.filterQueryParams = definedQPs;
      // search filters have changed; invalidate existing counts and match data pages if necessary:
      state.resultCountsInvalid = true;
      invalidateMatchData(state);
    },
    setTextQuery: (state, { payload }: PayloadAction<string>) => {
      if (state.textQuery === payload) return;
      state.textQuery = payload;
      // text query has changed; invalidate existing counts and match data pages if necessary:
      state.resultCountsInvalid = true;
      invalidateMatchData(state);
    },
    setTextQueryType: (state, { payload }: PayloadAction<FtsQueryType>) => {
      if (state.textQueryType === payload) return;
      state.textQueryType = payload;
      // text query type has changed; invalidate existing counts and match data pages if necessary:
      state.resultCountsInvalid = true;
      invalidateMatchData(state);
    },
    setDoneFirstLoad: (state) => {
      state.doneFirstLoad = true;
    },
    setSelectedEntity: (state, { payload }: PayloadAction<BentoCountEntity | null>) => {
      state.selectedEntity = payload;
    },
    setMatchesPage: (state, { payload }: PayloadAction<[BentoKatsuEntity | BentoCountEntity, number]>) => {
      const rdEntity = bentoKatsuEntityToResultsDataEntity(payload[0]);
      const md = state.matchData[rdEntity];
      if (isNaN(payload[1]) || payload[1] < 0) {
        console.error(`setMatchesPage invalid page: ${payload}`);
        return;
      }
      if (md.page === payload[1]) return;
      md.page = payload[1];
      // Invalidate current match data page contents if the page changes:
      md.invalid = md.status !== RequestStatus.Idle;
    },
    setMatchesPageSize: (state, { payload }: PayloadAction<number>) => {
      if (isNaN(payload) || !PAGE_SIZE_OPTIONS.includes(payload)) {
        console.error(`setMatchesPageSize invalid page size: ${payload}`);
        return;
      }
      if (payload === state.pageSize) return state;
      state.pageSize = payload;
      // Page size is a bit special since it's shared state across all match data, so special care has to be taken to
      // reset all pages and invalidate entities' match data if page state changes.
      invalidateMatchData(state);
    },
    resetAllQueryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(performKatsuDiscovery.pending, (state) => {
      state.discoveryStatus = RequestStatus.Pending;
    });
    builder.addCase(
      performKatsuDiscovery.fulfilled,
      (state, { payload: [scope, response] }: PayloadAction<[DiscoveryScope, DiscoveryResponseOrMessage]>) => {
        state.discoveryStatus = RequestStatus.Fulfilled;
        state.resultCountsInvalid = false;

        if (!response) {
          return;
        }

        if ('message' in response && response.message) {
          state.message = response.message;
        } else {
          state.message = '';
        }

        if ('counts' in response) {
          state.resultCountsOrBools = response.counts;

          // Side effects: saving/loading layout from local storage
          const { defaultLayout, sectionData } = discoveryChartProcessingAndLocalStorage(scope, response);
          state.defaultLayout = defaultLayout;
          state.sections = sectionData;
        }
      }
    );
    builder.addCase(performKatsuDiscovery.rejected, (state) => {
      state.discoveryStatus = RequestStatus.Rejected;
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
      state.matchData[bentoKatsuEntityToResultsDataEntity(meta.arg)].status = RequestStatus.Pending;
    });
    builder.addCase(fetchDiscoveryMatches.fulfilled, (state, { meta, payload }) => {
      const entity: ResultsDataEntity = bentoKatsuEntityToResultsDataEntity(meta.arg);
      const md = state.matchData[entity];
      md.status = RequestStatus.Fulfilled;
      md.matches = payload.results;
      md.totalMatches = payload.pagination.total;
      md.invalid = false;
    });
    builder.addCase(fetchDiscoveryMatches.rejected, (state, { meta }) => {
      state.matchData[bentoKatsuEntityToResultsDataEntity(meta.arg)].status = RequestStatus.Rejected;
    });
    // -----
    builder.addCase(fetchDiscoveryUIHints.pending, (state) => {
      state.uiHints.status = RequestStatus.Pending;
    });
    builder.addCase(fetchDiscoveryUIHints.fulfilled, (state, { payload }) => {
      state.uiHints.status = RequestStatus.Fulfilled;
      state.uiHints.data = payload;
    });
    builder.addCase(fetchDiscoveryUIHints.rejected, (state) => {
      state.uiHints.status = RequestStatus.Rejected;
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
  setFilterQueryParams,
  setTextQuery,
  setTextQueryType,
  setDoneFirstLoad,
  setSelectedEntity,
  setMatchesPage,
  setMatchesPageSize,
  resetAllQueryState,
} = query.actions;
export { performKatsuDiscovery, fetchSearchFields, fetchDiscoveryUIHints };
export default query.reducer;
