import { useEffect } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetConfigRequest } from '@/features/config/config.store';
import { useSelectedScope } from '@/features/metadata/hooks';

export const useConfig = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useIsAuthenticated();
  const { scope, scopeSet } = useSelectedScope();

  // Conditions where we need to reload "config" (which really is closer to rules for search):
  //  - authorization status changed
  //  - scope changed/was loaded from URL (scopeSet)
  useEffect(() => {
    dispatch(makeGetConfigRequest());
  }, [dispatch, isAuthenticated, scope, scopeSet]);

  const { configStatus, countThreshold, maxQueryParameters, maxQueryParametersRequired } = useAppSelector(
    (state) => state.config
  );

  return { configStatus, countThreshold, maxQueryParameters, maxQueryParametersRequired };
};
