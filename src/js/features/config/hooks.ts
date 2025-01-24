import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetConfigRequest } from '@/features/config/config.store';
import { useSelectedScope } from '@/features/metadata/hooks';

export const useConfig = () => {
  const dispatch = useAppDispatch();
  const { scopeSet } = useSelectedScope();
  const { configStatus, configIsInvalid, countThreshold, maxQueryParameters, maxQueryParametersRequired } =
    useAppSelector((state) => state.config);

  // Conditions where we need to reload "config" (which really is closer to rules for search):
  //  - scope was set (need to load for the first time)
  //  - config was invalidated (scope or authorization changed)
  useEffect(() => {
    if (scopeSet) {
      dispatch(makeGetConfigRequest());
    }
  }, [dispatch, scopeSet, configIsInvalid]);

  return { configStatus, configIsInvalid, countThreshold, maxQueryParameters, maxQueryParametersRequired };
};
