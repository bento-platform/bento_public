import type { PayloadAction } from '@reduxjs/toolkit';
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
  QueryParams,
  SearchFieldResponse,
  DiscoveryMatchObject,
  DiscoveryMatchPhenopacket,
  DiscoveryMatchBiosample,
  DiscoveryMatchExperiment,
  DiscoveryMatchExperimentResult,
  DiscoveryUIHints,
} from '@/features/search/types';
import type { Sections } from '@/types/data';

import { MIN_PAGE_SIZE } from '@/constants/pagination';

import { discoveryChartProcessingAndLocalStorage } from './discoveryChartProcessingAndLocalStorage';
import { performKatsuDiscovery } from './performKatsuDiscovery.thunk';
import { fetchSearchFields } from './fetchSearchFields.thunk';
import { fetchDiscoveryMatches } from './fetchDiscoveryMatches.thunk';
import { fetchDiscoveryUIHints } from './fetchDiscoveryUIHints.thunk';

export type QueryResultMatchData<T extends DiscoveryMatchObject> = {
  status: RequestStatus;
  page: number;
  totalMatches: number;
  matches: T[] | undefined;
};

export const bentoKatsuEntityToResultsDataEntity = (x: BentoKatsuEntity): ResultsDataEntity =>
  x === 'individual' ? 'phenopacket' : x;

export type QueryState = {
  defaultLayout: Sections;
  sections: Sections;
  // -------------------------------------
  fieldsStatus: RequestStatus;
  discoveryStatus: RequestStatus;
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

  selectedEntity: BentoCountEntity | null;

  // results
  resultCountsOrBools: KatsuEntityCountsOrBooleans;
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
      state.filterQueryParams = payload;
    },
    setTextQuery: (state, { payload }: PayloadAction<string>) => {
      state.textQuery = payload;
    },
    setDoneFirstLoad: (state) => {
      state.doneFirstLoad = true;
    },
    setSelectedEntity: (state, { payload }: PayloadAction<BentoCountEntity | null>) => {
      console.debug('setting selected entity', payload);
      state.selectedEntity = payload;
    },
    setMatchesPage: (state, { payload }: PayloadAction<[BentoKatsuEntity, number]>) => {
      state.matchData[bentoKatsuEntityToResultsDataEntity(payload[0])].page = payload[1];
    },
    resetMatchesPage: (state) => {
      Object.keys(state.matchData).forEach((k) => {
        state.matchData[k as ResultsDataEntity].page = 0;
      });
    },
    setMatchesPageSize: (state, { payload }: PayloadAction<number>) => {
      state.pageSize = payload;
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
      state.matchData[entity].status = RequestStatus.Fulfilled;
      state.matchData[entity].matches = payload.results;
      state.matchData[entity].totalMatches = payload.pagination.total;
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
  setDoneFirstLoad,
  setSelectedEntity,
  setMatchesPage,
  resetMatchesPage,
  setMatchesPageSize,
  resetAllQueryState,
} = query.actions;
export { performKatsuDiscovery, fetchSearchFields, fetchDiscoveryUIHints };
export default query.reducer;
