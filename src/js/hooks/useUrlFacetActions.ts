import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { navigate } from '@/hooks/router';
import { buildQueryParamsUrl, queryParamsWithoutKey, type QueryParamEntries } from '@/utils/queryParams';

/**
 * Generic URL-navigation actions for a facet-filtered listing: toggling a value within a
 * repeated-key facet param, setting/clearing a single scalar param, and clearing everything.
 * Pairs with {@link useUrlFacetSync}, which reflects the resulting URL back into a feature's
 * own store. Components should call these instead of dispatching filter changes directly.
 */
export function useUrlFacetActions<FacetId extends string>(facetIds: readonly FacetId[]) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const replaceParams = useCallback(
    (update: (prev: QueryParamEntries) => QueryParamEntries) =>
      navigate(buildQueryParamsUrl(pathname, update([...searchParams.entries()])), { replace: true }),
    [pathname, searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string, defaultValue = '') => {
      replaceParams((prev) => {
        const without = queryParamsWithoutKey(prev, key);
        return value !== defaultValue && value !== '' ? [...without, [key, value]] : without;
      });
    },
    [replaceParams]
  );

  const toggleFacetValue = useCallback(
    (facet: FacetId, value: string) => {
      replaceParams((prev) => {
        const has = prev.some(([k, v]) => k === facet && v === value);
        return has ? prev.filter(([k, v]) => !(k === facet && v === value)) : [...prev, [facet, value]];
      });
    },
    [replaceParams]
  );

  const clearAll = useCallback(
    (extraKeys: string[] = []) => {
      replaceParams((prev) => queryParamsWithoutKey(prev, [...extraKeys, ...facetIds]));
    },
    [replaceParams, facetIds]
  );

  return { setParam, toggleFacetValue, clearAll };
}
