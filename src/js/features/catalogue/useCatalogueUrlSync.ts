import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks';
import { useUrlFacetSync, type ScalarParam } from '@/hooks/useUrlFacetSync';
import { useUrlFacetActions } from '@/hooks/useUrlFacetActions';
import {
  hydrateFromUrl,
  FACET_IDS,
  type SortKey,
  type ViewMode,
  type CatalogueFilterSets,
  type FacetId,
  type CatalogueState,
} from './catalogue.store';

const SORT_PARAM: ScalarParam<SortKey> = {
  key: 'sort',
  defaultValue: 'updated_desc',
  validValues: ['updated_desc', 'created_desc', 'title_az', 'individuals_desc', 'biosamples_desc'],
};
const VIEW_PARAM: ScalarParam<ViewMode> = { key: 'view', defaultValue: 'grid', validValues: ['grid', 'list'] };
const SCALARS = { sort: SORT_PARAM, view: VIEW_PARAM };

/**
 * Builds the catalogue's URL query string ('' or '?...') from Redux catalogue state, using the same encoding
 * useCatalogueUrlSync parses. Lets in-app "back to catalogue" links restore applied filters without history.
 */
export const catalogueStateToSearch = ({ q, sets, sort, view }: CatalogueState): string => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  FACET_IDS.forEach((id) => sets[id].forEach((v) => params.append(id, v)));
  if (sort !== SORT_PARAM.defaultValue) params.set(SORT_PARAM.key, sort);
  if (view !== VIEW_PARAM.defaultValue) params.set(VIEW_PARAM.key, view);
  const s = params.toString();
  return s ? `?${s}` : '';
};

/**
 * The URL is the source of truth for catalogue filters. This hydrates Redux from it on mount
 * and on every subsequent navigation (including browser back/forward), via the generic
 * useUrlFacetSync, mirroring the pattern used by useSearchRouterAndHandler for the Search feature.
 */
export function useCatalogueUrlSync() {
  const dispatch = useAppDispatch();
  const onHydrate = useCallback(
    ({ q, sets, scalars }: { q: string; sets: CatalogueFilterSets; scalars: Record<string, string> }) => {
      dispatch(hydrateFromUrl({ q, sets, sort: scalars.sort as SortKey, view: scalars.view as ViewMode }));
    },
    [dispatch]
  );

  useUrlFacetSync(FACET_IDS, SCALARS, onHydrate);
}

/**
 * Actions that mutate catalogue filter state by navigating the URL. useCatalogueUrlSync reflects
 * the resulting URL change back into Redux, so components never dispatch filter changes directly.
 *
 * Facet values use repeated-key query params (?statuses=Ongoing&statuses=Completed), same encoding
 * as the Search feature, sharing queryParamsWithoutKey from @/utils/queryParams.
 */
export function useCatalogueUrlActions() {
  const { setParam, toggleFacetValue, clearAll } = useUrlFacetActions(FACET_IDS);

  const setSearch = useCallback((q: string) => setParam('q', q), [setParam]);
  const setSort = useCallback((sort: SortKey) => setParam('sort', sort, SORT_PARAM.defaultValue), [setParam]);
  const setView = useCallback((view: ViewMode) => setParam('view', view, VIEW_PARAM.defaultValue), [setParam]);
  const setFacetValue = useCallback((facet: FacetId, value: string) => setParam(facet, value), [setParam]);

  return {
    setSearch,
    setSort,
    setView,
    setFacetValue,
    toggleFacetValue,
    clearAll: useCallback(() => clearAll(['q']), [clearAll]),
  };
}
