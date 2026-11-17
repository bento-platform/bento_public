import type { AxiosRequestConfig } from 'axios';
import type { RootState } from '@/store';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { QueryParamEntries } from '@/features/search/types';

const _scopeEntries = (scope: DiscoveryScope): QueryParamEntries =>
  Object.entries(scope).filter(([_, v]) => v !== undefined);

export const scopedAuthorizedRequestConfig = (
  state: RootState,
  extraParams?: QueryParamEntries
): AxiosRequestConfig => ({
  params: new URLSearchParams([..._scopeEntries(state.metadata.selectedScope.scope), ...(extraParams ?? [])]),
});

export const scopedAuthorizedRequestConfigFromParts = (
  scope: DiscoveryScope,
  extraParams?: QueryParamEntries
): AxiosRequestConfig => ({
  params: new URLSearchParams([..._scopeEntries(scope), ...(extraParams ?? [])]),
});
