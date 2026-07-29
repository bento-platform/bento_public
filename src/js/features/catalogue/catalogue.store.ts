import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FacetId, SortKey } from './constants';
export { FACET_IDS } from './constants';
export type { FacetId, SortKey } from './constants';

export type ViewMode = 'grid' | 'list';

export type CatalogueFilterSets = Record<FacetId, string[]>;

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

// q, sort, view, and sets are URL-driven: the URL is the source of truth, and useCatalogueUrlSync
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
  },
});

export const { toggleInsights, toggleFacetCollapse, hydrateFromUrl, setProjectColors } = catalogueSlice.actions;
export default catalogueSlice.reducer;
