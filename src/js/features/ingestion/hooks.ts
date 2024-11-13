import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect } from 'react';
import { fetchGohanData, fetchKatsuData } from './lastIngestion.store';
import { useSelectedScope } from '@/features/metadata/hooks';

export const useLastIngestionData = () => {
  const dispatch = useAppDispatch();
  const { scope, scopeSet } = useSelectedScope();

  // TODO: rate limit / cache this better
  useEffect(() => {
    dispatch(fetchKatsuData());
  }, [dispatch, scope, scopeSet]);

  useEffect(() => {
    dispatch(fetchGohanData());
  }, [dispatch]);

  return useAppSelector((state) => state.lastIngestionData);
};
