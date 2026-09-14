import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useLanguage, useTranslationFn } from '@/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useMetadata } from '@/features/metadata/hooks';
import { FACET_IDS, type FacetId } from './constants';
import { FACET_CONFIG_BY_ID } from './facetRegistry';
import { searchDatasets } from './catalogue.store';
import { facetValueTranslationKey } from './utils';
import type { FacetOption } from './types';

const SEARCH_DEBOUNCE_MS = 300;

/** Selects the full catalogue slice from the Redux store. */
export function useCatalogueState() {
  return useAppSelector((state) => state.catalogue);
}

/**
 * Drives the catalogue page's data from GET /api/datasets: debounces the free-text query, builds the
 * request params from the current URL-derived filter/sort/page state, and (re)dispatches searchDatasets
 * whenever any of them change — aborting a still-in-flight request if it's superseded before it resolves.
 */
export function useCatalogueSearch() {
  const dispatch = useAppDispatch();
  const state = useCatalogueState();
  const { q, sets, sort, page } = state;
  const language = useLanguage();
  const debouncedQ = useDebouncedValue(q, SEARCH_DEBOUNCE_MS);

  const params = new URLSearchParams();
  if (debouncedQ) params.set('q', debouncedQ);
  for (const facetId of FACET_IDS) {
    for (const value of sets[facetId]) params.append(facetId, value);
  }
  params.set('sort', sort);
  params.set('page', String(page));
  params.set('include', 'facets,totals');

  // `sets` is a freshly-built object on every URL hydration (see useUrlFacetSync), even when its content
  // hasn't changed (e.g. toggling grid/list view also re-hydrates it), so the effect keys off the serialized
  // query string (plus language, which isn't part of the query string but does change the response) rather
  // than object identity, to avoid refetching on unrelated URL changes.
  const paramsKey = params.toString();

  useEffect(() => {
    const promise = dispatch(searchDatasets({ params: new URLSearchParams(paramsKey), language }));
    return () => promise.abort();
  }, [dispatch, paramsKey, language]);

  return state;
}

/**
 * Turns a raw facet value into a display string. Every facet value doubles as its own label (translated via
 * i18nKeyPrefix where one is configured) *except* `project`, whose value is the project's UUID identifier
 * (see dataset_facets.py on the backend) rather than its title — that one needs a lookup against the
 * already-loaded project list to show something human-readable.
 */
export function useFacetValueLabel() {
  const t = useTranslationFn();
  const { projectsByID } = useMetadata();

  return (facetId: FacetId, value: string): string => {
    if (facetId === 'project') return projectsByID[value]?.title ?? value;
    return t(facetValueTranslationKey(FACET_CONFIG_BY_ID[facetId].i18nKeyPrefix, value));
  };
}

/**
 * Builds display-ready facet options from the server's raw `facets` response: applies each facet's fixed
 * display `order` (falling back to the server's own count-desc order otherwise), resolves labels via
 * {@link useFacetValueLabel}, and flags currently-selected values (the server already includes selected
 * values at count 0 and excludes each facet's own active filter from its own counts — see compute_facets
 * on the backend — so no re-filtering is needed here, only display formatting).
 */
export function useCatalogueFacetOptions(): (facetId: FacetId) => FacetOption[] {
  const { sets, searchFacets } = useCatalogueState();
  const getLabel = useFacetValueLabel();

  return (facetId: FacetId) => {
    const raw = searchFacets?.[facetId] ?? [];
    const selected = sets[facetId];
    const order = FACET_CONFIG_BY_ID[facetId].order;

    const sorted = order
      ? [...raw].sort((a, b) => {
          const ai = order.indexOf(a.value);
          const bi = order.indexOf(b.value);
          if (ai === -1 && bi === -1) return a.value.localeCompare(b.value);
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        })
      : raw;

    return sorted.map((o) => ({
      value: o.value,
      label: getLabel(facetId, o.value),
      count: o.count,
      selected: selected.includes(o.value),
    }));
  };
}
