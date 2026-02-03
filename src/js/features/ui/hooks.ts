import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { CHART_DIMENSIONS } from '@/constants/overviewConstants';
import { setExtraBreadcrumb } from './ui.store';

export const useUiState = () => useAppSelector((state) => state.ui);

export const useUiUserSettings = () => useUiState().settings;
export const useDashboardChartDimensions = () => {
  const { dashboardChartMode } = useUiUserSettings();
  return CHART_DIMENSIONS[dashboardChartMode];
};

export const useExtraBreadcrumb = () => useUiState().extraBreadcrumb;

export const useSetExtraBreadcrumb = (title: string | undefined) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (title) {
      dispatch(setExtraBreadcrumb({ title }));
    }

    return () => {
      dispatch(setExtraBreadcrumb(null));
    };
  }, [dispatch, title]);
};
