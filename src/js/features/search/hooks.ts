import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetIndividualData } from '@/features/search/makeGetIndividualData.thunk';
import { RequestStatus } from '@/types/requests';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useIndividualData = (id: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetIndividualData(id));
  }, [dispatch, id]);

  const individualData = useAppSelector((state) => state.query.individualDataCache[id]);
  return individualData;
};

export const useIsFetchingIndividualData = (id: string) => {
  const individualDataStatus = useAppSelector((state) => state.query.individualDataStatus[id]);
  return individualDataStatus === RequestStatus.Pending;
};
