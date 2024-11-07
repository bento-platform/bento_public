import { useEffect } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { useSelectedScope } from '@/features/metadata/hooks';

export const useConfig = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useIsAuthenticated();
  const { scope, scopeSet } = useSelectedScope();

  useEffect(() => {
    dispatch(makeGetConfigRequest());
  }, [dispatch, isAuthenticated, scope, scopeSet]);

  const { isFetchingConfig, hasAttemptedConfig, configIsInvalid, maxQueryParameters, maxQueryParametersRequired } =
    useAppSelector((state) => state.config);

  return { isFetchingConfig, hasAttemptedConfig, configIsInvalid, maxQueryParameters, maxQueryParametersRequired };
};

export const useServiceInfo = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetServiceInfoRequest());
  }, [dispatch]);

  const { isFetchingServiceInfo, hasAttemptedServiceInfo, serviceInfo } = useAppSelector((state) => state.config);

  return { isFetchingServiceInfo, hasAttemptedServiceInfo, serviceInfo };
};
