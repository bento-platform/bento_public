import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queryParamsWithoutKey, type QueryParamEntries } from '@/utils/queryParams';

/**
 * Generic URL-navigation actions for a facet-filtered listing: toggling a value within a
 * repeated-key facet param, setting/clearing a single scalar param, and clearing everything.
 * Pairs with {@link useUrlFacetSync}, which reflects the resulting URL back into a feature's
 * own store. Components should call these instead of dispatching filter changes directly.
 */
export function useUrlFacetActions<FacetId extends string>(facetIds: readonly FacetId[]) {
  const [, setSearchParams] = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string, defaultValue = '') => {
      setSearchParams(
        (prev) => {
          const without = queryParamsWithoutKey([...prev.entries()], key);
          return value !== defaultValue && value !== '' ? [...without, [key, value]] : without;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const toggleFacetValue = useCallback(
    (facet: FacetId, value: string) => {
      setSearchParams(
        (prev) => {
          const entries = [...prev.entries()] as QueryParamEntries;
          const has = entries.some(([k, v]) => k === facet && v === value);
          return has ? entries.filter(([k, v]) => !(k === facet && v === value)) : [...entries, [facet, value]];
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearAll = useCallback(
    (extraKeys: string[] = []) => {
      setSearchParams((prev) => queryParamsWithoutKey([...prev.entries()], [...extraKeys, ...facetIds]), {
        replace: true,
      });
    },
    [setSearchParams, facetIds]
  );

  return { setParam, toggleFacetValue, clearAll };
}
