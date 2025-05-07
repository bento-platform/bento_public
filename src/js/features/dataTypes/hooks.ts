import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetDataTypes } from './dataTypes.store';

export const useDataTypes = () => {
  const dispatch = useAppDispatch();
  const dataTypesState = useAppSelector((state) => state.dataTypes);

  useEffect(() => {
    dispatch(makeGetDataTypes());
  }, [dispatch, dataTypesState.isInvalid]);

  return dataTypesState;
};
