import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { ChartSizeMode, UIUserSettings } from './types';
import { LOCALSTORAGE_UI_SETTINGS_KEY } from '@/constants/ui';
import { getValue } from '@/utils/localStorage';

const storeName = 'ui';

export type UIState = {
  extraBreadcrumb: BreadcrumbItemType | null;
  settings: UIUserSettings;
};

const defaultInitialSettings: UIUserSettings = {
  overviewChartMode: 'normal',
};

const VALID_CHART_MODES = ['compact', 'normal'];

/** Validates UI settings loaded from LocalStorage. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUiSettings = (data: any): boolean => {
  if (typeof data !== 'object') return false;
  const keys = Object.keys(data);
  if (JSON.stringify([...keys].sort()) !== JSON.stringify(Object.keys(defaultInitialSettings).sort())) return false;
  // Validation logic - right now just validating chart mode
  return VALID_CHART_MODES.includes(data.overviewChartMode);
};

const initialState: UIState = {
  extraBreadcrumb: null,
  // Load from LocalStorage if set. The corresponding persist-to-LS logic is handled by an observer in /src/js/store.ts.
  settings: getValue(LOCALSTORAGE_UI_SETTINGS_KEY, defaultInitialSettings, validateUiSettings),
};

const ui = createSlice({
  name: storeName,
  initialState,
  reducers: {
    setExtraBreadcrumb: (state, { payload }: PayloadAction<BreadcrumbItemType | null>) => {
      return { ...state, extraBreadcrumb: payload };
    },
    setOverviewChartMode: (state, { payload }: PayloadAction<ChartSizeMode>) => {
      state.settings.overviewChartMode = payload;
    },
  },
});

export const { setExtraBreadcrumb, setOverviewChartMode } = ui.actions;
export default ui.reducer;
