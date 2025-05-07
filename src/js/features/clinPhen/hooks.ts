import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';

export const useIndividualData = (id: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const data = useAppSelector((state) => state.clinPhen.individualDataCache[id]);
  const status = useAppSelector((state) => state.clinPhen.individualDataStatus[id]);

  return { data, status };
};
