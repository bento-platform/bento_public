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

const initialState: UIState = {
  extraBreadcrumb: null,
  settings: getValue(LOCALSTORAGE_UI_SETTINGS_KEY, defaultInitialSettings, (data) => {
    if (typeof data !== 'object') return false;
    const keys = Object.keys(data);
    if (JSON.stringify([...keys].sort()) !== JSON.stringify(Object.keys(defaultInitialSettings).sort())) return false;
    return ['compact', 'normal'].includes(data.overviewChartMode);
  }),
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

export const { setExtraBreadcrumb } = ui.actions;
export default ui.reducer;
