import { useEffect, useMemo } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';

type LazyLoadHookOptions = { fetchEnabled: boolean };

export const useData = ({ fetchEnabled }: LazyLoadHookOptions) => {
  const dispatch = useAppDispatch();

  // Begin data refresh trigger dependencies
  const isAuthenticated = useIsAuthenticated();
  const { scope, scopeSet } = useSelectedScope();
  // End data refresh trigger dependencies

  const state = useAppSelector((state) => state.data);

  useEffect(() => {
    if (fetchEnabled && scopeSet) {
      // Parameter to turn off data fetching in some circumstances, e.g., if the data catalogue is being shown.
      // In this way we can avoid making needless fetches up front.
      dispatch(makeGetDataRequestThunk());
    }
  }, [dispatch, fetchEnabled, isAuthenticated, scope, scopeSet]);

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
