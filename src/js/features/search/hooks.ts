import { useEffect } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';

export const useSearchQuery = () => {
  const dispatch = useAppDispatch();

  // Begin data refresh trigger dependencies
  const isAuthenticated = useIsAuthenticated();
  const { scopeSet } = useSelectedScope();
  // End data refresh trigger dependencies

  const state = useAppSelector((state) => state.query);

  useEffect(() => {
    dispatch(makeGetSearchFields());
  }, [dispatch, isAuthenticated, scopeSet]);

  useEffect(() => {
    dispatch(makeGetKatsuPublic());
  }, [dispatch, isAuthenticated, scopeSet, state.querySections]);

  return state;
};
