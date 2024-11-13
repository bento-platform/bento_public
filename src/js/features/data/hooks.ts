import { useEffect, useMemo } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';
import { useSearchQuery } from '@/features/search/hooks';

export const useData = () => {
  const dispatch = useAppDispatch();

  // Begin data refresh trigger dependencies
  const isAuthenticated = useIsAuthenticated();
  const { scopeSet } = useSelectedScope();
  // End data refresh trigger dependencies

  const state = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(makeGetDataRequestThunk());
  }, [dispatch, isAuthenticated, scopeSet, state.isInvalid]);

  return state;
};

export const useSearchableFields = () => {
  /**
   * Hook which calculates a set of searchable fields (which share IDs with charts), which can be used, for example, to
   * choose whether to add a click event to a chart for the field.
   */
  const { querySections } = useSearchQuery();
  return useMemo(
    () => new Set(querySections.flatMap((section) => section.fields).map((field) => field.id)),
    [querySections]
  );
};
