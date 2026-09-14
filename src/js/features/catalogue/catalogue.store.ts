import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios, { type AxiosRequestConfig } from 'axios';
import type { HexColor } from 'bento-charts';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { authorizedRequestConfig } from '@/utils/requests';
import { printAPIError } from '@/utils/error.util';
import { datasetsUrl } from '@/constants/configConstants';
import { FACET_IDS, type FacetId, type SortKey } from './constants';
import type { DatasetFacetOption, DatasetSearchResponse, DatasetSearchTotals } from './types';
import type { Dataset } from '@/types/dataset';
export { FACET_IDS } from './constants';
export type { FacetId, SortKey } from './constants';

export type ViewMode = 'grid' | 'list';

export type CatalogueFilterSets = Record<FacetId, string[]>;

export interface CatalogueState {
  q: string;
  sets: CatalogueFilterSets;
  sort: SortKey;
  view: ViewMode;
  page: number;
  insightsOpen: boolean;
  collapsedFacets: string[];
  projectColors: Record<string, HexColor>;
  searchStatus: RequestStatus;
  searchError: string;
  searchResults: Dataset[];
  searchCount: number;
  searchFacets: Record<FacetId, DatasetFacetOption[]> | null;
  searchTotals: DatasetSearchTotals | null;
}

const EMPTY_SETS: CatalogueFilterSets = Object.fromEntries(
  FACET_IDS.map((fId) => [fId, [] as string[]])
) as CatalogueFilterSets;

const initialState: CatalogueState = {
  q: '',
  sets: { ...EMPTY_SETS },
  sort: 'updated_desc',
  view: 'grid',
  page: 1,
  insightsOpen: true,
  collapsedFacets: [],
  projectColors: {},
  searchStatus: RequestStatus.Idle,
  searchError: '',
  searchResults: [],
  searchCount: 0,
  searchFacets: null,
  searchTotals: null,
};

/**
 * Fetches the current page of search results (plus facet option counts and aggregate totals) from
 * GET /api/datasets, given the URLSearchParams built by useCatalogueSearch. Forwards the thunk's abort
 * signal to axios so a superseded request (rapid typing/toggling) can be cancelled.
 */
export const searchDatasets = createAsyncThunk<
  DatasetSearchResponse,
  URLSearchParams,
  { state: RootState; rejectValue: string }
>('catalogue/searchDatasets', (params, { getState, signal, rejectWithValue }) => {
  const config: AxiosRequestConfig = { ...authorizedRequestConfig(getState()), params, signal };
  return axios
    .get(datasetsUrl, config)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});

// q, sort, view, page, and sets are URL-driven: the URL is the source of truth, and useCatalogueUrlSync
// is the only place that writes them into Redux (via hydrateFromUrl), reacting to navigation.
// Components mutate them by navigating (see useCatalogueUrlActions), never by dispatching directly.
const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    toggleInsights(state) {
      state.insightsOpen = !state.insightsOpen;
    },
    toggleFacetCollapse(state, action: PayloadAction<string>) {
      const facet = action.payload;
      state.collapsedFacets = state.collapsedFacets.includes(facet)
        ? state.collapsedFacets.filter((f) => f !== facet)
        : [...state.collapsedFacets, facet];
    },
    hydrateFromUrl(
      state,
      action: PayloadAction<{ q: string; sort: SortKey; view: ViewMode; page: number; sets: CatalogueFilterSets }>
    ) {
      state.q = action.payload.q;
      state.sort = action.payload.sort;
      state.view = action.payload.view;
      state.page = action.payload.page;
      state.sets = action.payload.sets;
    },
    setProjectColors(state, action: PayloadAction<Record<string, HexColor>>) {
      state.projectColors = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(searchDatasets.pending, (state) => {
      // Keep the last-good results/facets/totals visible while a new request is in flight, so
      // typing/toggling filters doesn't flash the grid/rail/banner empty.
      state.searchStatus = RequestStatus.Pending;
    });
    builder.addCase(searchDatasets.fulfilled, (state, { payload }) => {
      state.searchStatus = RequestStatus.Fulfilled;
      state.searchError = '';
      state.searchResults = payload.results;
      state.searchCount = payload.count;
      state.searchFacets = payload.facets ?? null;
      state.searchTotals = payload.totals ?? null;
    });
    builder.addCase(searchDatasets.rejected, (state, { payload, meta }) => {
      if (meta.aborted) return; // superseded by a newer request; not a real failure
      state.searchStatus = RequestStatus.Rejected;
      if (typeof payload === 'string') {
        state.searchError = payload;
      }
    });
  },
});

export const { toggleInsights, toggleFacetCollapse, hydrateFromUrl, setProjectColors } = catalogueSlice.actions;
export default catalogueSlice.reducer;
