import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
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

function splitParam(v: string | null): string[] {
  return v ? v.split(',').filter(Boolean) : [];
}

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
      FACET_IDS.map((facet) => [facet, splitParam(searchParams.get(facet))])
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
 */
export function useCatalogueUrlActions() {
  const [, setSearchParams] = useSearchParams();

  const setSearch = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) next.set('q', q);
          else next.delete('q');
          return next;
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
          const next = new URLSearchParams(prev);
          if (sort !== 'updated_desc') next.set('sort', sort);
          else next.delete('sort');
          return next;
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
          const next = new URLSearchParams(prev);
          if (view !== 'grid') next.set('view', view);
          else next.delete('view');
          return next;
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
          const next = new URLSearchParams(prev);
          const current = splitParam(next.get(facet));
          const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
          if (updated.length > 0) next.set(facet, updated.join(','));
          else next.delete(facet);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearAll = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        for (const facet of FACET_IDS) next.delete(facet);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return { setSearch, setSort, setView, toggleFacetValue, clearAll };
}
