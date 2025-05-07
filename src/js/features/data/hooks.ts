import { useEffect, useMemo } from 'react';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';

export const useData = () => {
  const dispatch = useAppDispatch();
  const { scopeSet } = useSelectedScope();
  const state = useAppSelector((state) => state.data);

  useEffect(() => {
    if (scopeSet) {
      // dispatch action if scope is set and/or the state is invalidated and then this hook is called.
      dispatch(makeGetDataRequestThunk());
    }
  }, [dispatch, scopeSet, state.isInvalid]);

  return state;
};

export const useSearchableFields = () => {
  /**
   * Hook which calculates a set of searchable fields (which share IDs with charts), which can be used, for example, to
   * choose whether to add a click event to a chart for the field.
   */
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => new Set(filterSections.flatMap((section) => section.fields).map((field) => field.id)),
    [filterSections]
  );
};
