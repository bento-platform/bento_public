import type { AxiosRequestConfig } from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import type { RootState } from '@/store';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';

type AuthState = RootState['auth'];

export const authorizedRequestConfig = (state: RootState): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(state.auth.accessToken) },
});

export const scopedAuthorizedRequestConfig = (
  state: RootState,
  extraParams: Record<string, string | undefined> | undefined = undefined
): AxiosRequestConfig => ({
  ...authorizedRequestConfig(state),
  params: { ...state.metadata.selectedScope.scope, ...extraParams },
});

export const scopedAuthorizedRequestConfigFromParts = (
  auth: AuthState,
  selectedScope: DiscoveryScopeSelection,
  extraParams: Record<string, string | undefined> | undefined = undefined
): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(auth.accessToken) },
  params: { ...selectedScope.scope, ...extraParams },
});
