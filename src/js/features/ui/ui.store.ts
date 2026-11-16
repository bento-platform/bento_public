import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { ChartSizeMode, UIUserSettings } from './types';
import { LOCALSTORAGE_UI_SETTINGS_KEY } from '@/constants/ui';
import { getValue } from '@/utils/localStorage';
import type { QueryParamEntries } from '@/utils/queryParams';

const storeName = 'ui';

/**
 * Where the dataset scope's back button should go, recorded when the user enters a dataset from one of its cards.
 * For a project origin, the project's Explore search is snapshotted, since entering the dataset replaces the search
 * state with the dataset's own. The catalogue's filters live in their own slice, which isn't touched by leaving it.
 */
export type DatasetBackTarget =
  | { dataset: string; origin: 'catalogue' }
  | { dataset: string; origin: 'project'; project: string; exploreQueryParams: QueryParamEntries };

export type UIState = {
  extraBreadcrumb: BreadcrumbItemType | null;
  manageChartsVisible: boolean;
  settings: UIUserSettings;
  datasetBackTarget: DatasetBackTarget | null;
};

const defaultInitialSettings: UIUserSettings = {
  exploreChartMode: 'normal',
};

const VALID_CHART_MODES = ['compact', 'normal'];

/** Validates UI settings loaded from LocalStorage. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUiSettings = (data: any): boolean => {
  if (typeof data !== 'object') return false;
  const keys = Object.keys(data);
  if (JSON.stringify([...keys].sort()) !== JSON.stringify(Object.keys(defaultInitialSettings).sort())) return false;
  // Validation logic - right now just validating chart mode
  return VALID_CHART_MODES.includes(data.exploreChartMode);
};

const initialState: UIState = {
  extraBreadcrumb: null,
  manageChartsVisible: false,
  // Load from LocalStorage if set. The corresponding persist-to-LS logic is handled by an observer in /src/js/store.ts.
  settings: getValue(LOCALSTORAGE_UI_SETTINGS_KEY, defaultInitialSettings, validateUiSettings),
  datasetBackTarget: null,
};

const ui = createSlice({
  name: storeName,
  initialState,
  reducers: {
    setExtraBreadcrumb: (state, { payload }: PayloadAction<BreadcrumbItemType | null>) => {
      return { ...state, extraBreadcrumb: payload };
    },
    setManageChartsVisible: (state, { payload }: PayloadAction<boolean>) => {
      state.manageChartsVisible = payload;
    },
    setExploreChartMode: (state, { payload }: PayloadAction<ChartSizeMode>) => {
      state.settings.exploreChartMode = payload;
    },
    setDatasetBackTarget: (state, { payload }: PayloadAction<DatasetBackTarget | null>) => {
      state.datasetBackTarget = payload;
    },
  },
});

export const { setExtraBreadcrumb, setManageChartsVisible, setExploreChartMode, setDatasetBackTarget } = ui.actions;
export default ui.reducer;
