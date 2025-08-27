import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setExtraBreadcrumb } from './ui.store';

export const useExtraBreadcrumb = () => useAppSelector((state) => state.ui.extraBreadcrumb);

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
