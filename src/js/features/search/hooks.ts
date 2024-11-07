import { useAppDispatch, useAppSelector } from '@/hooks';
import { useEffect } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useSelectedScope } from '@/features/metadata/hooks';
import { makeGetSearchFields } from '@/features/search/makeGetSearchFields.thunk';
import { makeGetKatsuPublic } from '@/features/search/makeGetKatsuPublic.thunk';

export const useSearchQuery = () => {
  const dispatch = useAppDispatch();

  // Begin data refresh trigger dependencies
  const isAuthenticated = useIsAuthenticated();
  const { scopeSet } = useSelectedScope();
  // End data refresh trigger dependencies

  const state = useAppSelector((state) => state.query);

  useEffect(() => {
    dispatch(makeGetSearchFields());
  }, [dispatch, isAuthenticated, scopeSet, state.querySectionsInvalid]);

  useEffect(() => {
    dispatch(makeGetKatsuPublic());
  }, [dispatch, isAuthenticated, scopeSet, state.querySections, state.resultsInvalid]);

  return state;
};
