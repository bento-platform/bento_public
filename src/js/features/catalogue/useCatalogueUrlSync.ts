import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { queryParamsWithoutKey, type QueryParamEntries } from '@/utils/queryParams';
import {
  hydrateFromUrl,
  FACET_IDS,
  type SortKey,
  type ViewMode,
  type FacetId,
  type CatalogueFilterSets,
} from './catalogue.store';

const VALID_SORTS: SortKey[] = ['updated_desc', 'created_desc', 'title_az', 'individuals_desc', 'biosamples_desc'];
const VALID_VIEWS: ViewMode[] = ['grid', 'list'];

/**
 * The URL is the source of truth for catalogue filters. This hydrates Redux from it on mount
 * and on every subsequent navigation (including browser back/forward), mirroring the pattern
 * used by useSearchRouterAndHandler for the Search feature.
 */
export function useCatalogueUrlSync() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rawSort = searchParams.get('sort');
    const rawView = searchParams.get('view');
    const sets = Object.fromEntries(
      FACET_IDS.map((facet) => [facet, searchParams.getAll(facet)])
    ) as unknown as CatalogueFilterSets;
    dispatch(
      hydrateFromUrl({
        q: searchParams.get('q') ?? '',
        sort: VALID_SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : 'updated_desc',
        view: VALID_VIEWS.includes(rawView as ViewMode) ? (rawView as ViewMode) : 'grid',
        sets,
      })
    );
  }, [searchParams, dispatch]);
}

/**
 * Actions that mutate catalogue filter state by navigating the URL. useCatalogueUrlSync reflects
 * the resulting URL change back into Redux, so components never dispatch filter changes directly.
 *
 * Facet values use repeated-key query params (?statuses=Ongoing&statuses=Completed), same encoding
 * as the Search feature, sharing queryParamsWithoutKey from @/utils/queryParams.
 */
export function useCatalogueUrlActions() {
  const [, setSearchParams] = useSearchParams();

  const setSearch = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const without = queryParamsWithoutKey([...prev.entries()], 'q');
          return q ? [...without, ['q', q]] : without;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSort = useCallback(
    (sort: SortKey) => {
      setSearchParams(
        (prev) => {
          const without = queryParamsWithoutKey([...prev.entries()], 'sort');
          return sort !== 'updated_desc' ? [...without, ['sort', sort]] : without;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setView = useCallback(
    (view: ViewMode) => {
      setSearchParams(
        (prev) => {
          const without = queryParamsWithoutKey([...prev.entries()], 'view');
          return view !== 'grid' ? [...without, ['view', view]] : without;
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

  const clearAll = useCallback(() => {
    setSearchParams((prev) => queryParamsWithoutKey([...prev.entries()], ['q', ...FACET_IDS]), { replace: true });
  }, [setSearchParams]);

  return { setSearch, setSort, setView, toggleFacetValue, clearAll };
}
