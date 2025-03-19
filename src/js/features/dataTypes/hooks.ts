import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect } from 'react';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { useMetadata } from '@/features/metadata/hooks';

export const useDataTypes = () => {
  const dispatch = useAppDispatch();
  const dataTypesState = useAppSelector((state) => state.dataTypes);
  const {
    selectedScope: { scopeSet },
  } = useMetadata();

  useEffect(() => {
    dispatch(makeGetDataTypes());
  }, [dispatch, scopeSet, dataTypesState.isInvalid]);

  return dataTypesState;
};
