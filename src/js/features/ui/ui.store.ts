import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import type { DashboardChartMode, UIUserSettings } from './types';

const storeName = 'ui';

export type UIState = {
  extraBreadcrumb: BreadcrumbItemType | null;
  settings: UIUserSettings;
};

const initialState: UIState = {
  extraBreadcrumb: null,
  settings: {
    dashboardChartMode: 'normal',
  },
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
