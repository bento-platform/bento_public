import type { AxiosRequestConfig } from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import type { RootState } from '@/store';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { QueryParamEntries } from '@/features/search/types';

type AuthState = RootState['auth'];

export const authorizedRequestConfig = (state: RootState): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(state.auth.accessToken) },
});

const _scopeEntries = (scope: DiscoveryScope): QueryParamEntries =>
  Object.entries(scope).filter(([_, v]) => v !== undefined);

export const scopedAuthorizedRequestConfig = (
  state: RootState,
  extraParams?: QueryParamEntries
): AxiosRequestConfig => ({
  ...authorizedRequestConfig(state),
  params: new URLSearchParams([..._scopeEntries(state.metadata.selectedScope.scope), ...(extraParams ?? [])]),
});

export const scopedAuthorizedRequestConfigFromParts = (
  auth: AuthState,
  scope: DiscoveryScope,
  extraParams?: QueryParamEntries
): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(auth.accessToken) },
  params: new URLSearchParams([..._scopeEntries(scope), ...(extraParams ?? [])]),
});
