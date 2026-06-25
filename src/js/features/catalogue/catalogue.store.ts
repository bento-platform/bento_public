import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type FacetId } from './constants';
export { FACET_IDS } from './constants';
export type { FacetId } from './constants';

export type SortKey = 'updated_desc' | 'created_desc' | 'title_az' | 'individuals_desc' | 'biosamples_desc';
export type ViewMode = 'grid' | 'list';

export interface CatalogueFilterSets {
  projects: string[];
  dataTypes: string[];
  taxa: string[];
  access: string[];
  licenses: string[];
  statuses: string[];
  keywords: string[];
}

export interface CatalogueState {
  q: string;
  sets: CatalogueFilterSets;
  sort: SortKey;
  view: ViewMode;
  insightsOpen: boolean;
  collapsedFacets: string[];
  projectColors: Record<string, string>;
}

const EMPTY_SETS: CatalogueFilterSets = {
  projects: [],
  dataTypes: [],
  taxa: [],
  access: [],
  licenses: [],
  statuses: [],
  keywords: [],
};

const initialState: CatalogueState = {
  q: '',
  sets: { ...EMPTY_SETS },
  sort: 'updated_desc',
  view: 'grid',
  insightsOpen: true,
  collapsedFacets: [],
  projectColors: {},
};

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    toggleFacetValue(state, action: PayloadAction<{ facet: FacetId; value: string }>) {
      const { facet, value } = action.payload;
      const current = state.sets[facet];
      state.sets[facet] = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    },
    setSearch(state, action: PayloadAction<string>) {
      state.q = action.payload;
    },
    setSort(state, action: PayloadAction<SortKey>) {
      state.sort = action.payload;
    },
    setView(state, action: PayloadAction<ViewMode>) {
      state.view = action.payload;
    },
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
      action: PayloadAction<{ q: string; sort: SortKey; view: ViewMode; sets: CatalogueFilterSets }>
    ) {
      state.q = action.payload.q;
      state.sort = action.payload.sort;
      state.view = action.payload.view;
      state.sets = action.payload.sets;
    },
    setProjectColors(state, action: PayloadAction<Record<string, string>>) {
      state.projectColors = action.payload;
    },
    clearAll(state) {
      state.q = '';
      state.sets = { ...EMPTY_SETS };
    },
  },
});

export const {
  toggleFacetValue,
  setSearch,
  setSort,
  setView,
  toggleInsights,
  toggleFacetCollapse,
  hydrateFromUrl,
  setProjectColors,
  clearAll,
} = catalogueSlice.actions;
export default catalogueSlice.reducer;
