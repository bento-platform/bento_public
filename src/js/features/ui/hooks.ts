import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setExtraBreadcrumb } from './ui.store';

export const useUiState = () => useAppSelector((state) => state.ui);

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

export const useUiSettings = () => useUiState().settings;
