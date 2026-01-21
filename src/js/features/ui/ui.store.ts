import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { DashboardChartMode, UIUserSettings } from './types';
import { getValue } from '@/utils/localStorage';
import { LOCALSTORAGE_UI_SETTINGS_KEY } from '@/constants/ui';
import { DASHBOARD_CHART_MODES } from './constants';

const storeName = 'ui';

export type UIState = {
  extraBreadcrumb: BreadcrumbItemType | null;
  settings: UIUserSettings;
};

const defaultInitialSettings: UIUserSettings = {
  dashboardChartMode: 'normal',
};

const initialState: UIState = {
  extraBreadcrumb: null,
  // Load UI settings from LocalStorage for the initial value, if present. Otherwisew, fall back to above defaults.
  settings: getValue(LOCALSTORAGE_UI_SETTINGS_KEY, defaultInitialSettings, (data) => {
    if (typeof data !== 'object') return false;
    const keys = Object.keys(data);
    if (JSON.stringify([...keys].sort()) !== JSON.stringify(Object.keys(defaultInitialSettings).sort())) return false;
    return DASHBOARD_CHART_MODES.includes(data.dashboardChartMode);
  }),
};

const ui = createSlice({
  name: storeName,
  initialState,
  reducers: {
    setExtraBreadcrumb: (state, { payload }: PayloadAction<BreadcrumbItemType | null>) => {
      return { ...state, extraBreadcrumb: payload };
    },
    setDashboardChartMode: (state, { payload }: PayloadAction<DashboardChartMode>) => {
      state.settings.dashboardChartMode = payload;
    },
  },
});

export const { setExtraBreadcrumb, setDashboardChartMode } = ui.actions;
export default ui.reducer;
