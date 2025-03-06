import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetIndividualData } from './makeGetIndividualData.thunk';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useIndividualData = (id: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const data = useAppSelector((state) => state.query.individualDataCache[id]);
  const status = useAppSelector((state) => state.query.individualDataStatus[id]);

  return { data, status };
};
