import type { AxiosRequestConfig } from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import type { RootState } from '@/store';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { DefinedQueryParams, QueryParams } from '@/features/search/types';

type AuthState = RootState['auth'];

export const definedQueryParams = (queryParams: QueryParams): DefinedQueryParams =>
  Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v !== undefined)) as DefinedQueryParams;

export const authorizedRequestConfig = (state: RootState): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(state.auth.accessToken) },
});

export const scopedAuthorizedRequestConfig = (state: RootState, extraParams?: QueryParams): AxiosRequestConfig => ({
  ...authorizedRequestConfig(state),
  params: { ...state.metadata.selectedScope.scope, ...extraParams },
});

export const scopedAuthorizedRequestConfigFromParts = (
  auth: AuthState,
  selectedScope: DiscoveryScopeSelection,
  extraParams?: QueryParams
): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(auth.accessToken) },
  params: { ...selectedScope.scope, ...definedQueryParams(extraParams ?? {}) },
});
