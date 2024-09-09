import type { AxiosRequestConfig } from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import type { RootState } from '@/store';

export const authorizedRequestConfig = (state: RootState): AxiosRequestConfig => ({
  headers: { ...makeAuthorizationHeader(state.auth.accessToken) },
});

export const scopedAuthorizedRequestConfig = (
  state: RootState,
  extraParams: Record<string, string> | undefined = undefined
): AxiosRequestConfig => ({
  ...authorizedRequestConfig(state),
  params: { ...state.metadata.selectedScope, ...extraParams },
});
