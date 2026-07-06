import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { useCatalogueState } from './hooks';
import { hydrateFromUrl, FACET_IDS, type SortKey, type ViewMode, type CatalogueFilterSets } from './catalogue.store';

const VALID_SORTS: SortKey[] = ['updated_desc', 'created_desc', 'title_az', 'individuals_desc', 'biosamples_desc'];
const VALID_VIEWS: ViewMode[] = ['grid', 'list'];

function splitParam(v: string | null): string[] {
  return v ? v.split(',').filter(Boolean) : [];
}

export function useCatalogueUrlSync() {
  const dispatch = useAppDispatch();
  const state = useCatalogueState();
  const [searchParams, setSearchParams] = useSearchParams();
  const skipFirstSync = useRef(true);

  // Mount: read URL → hydrate Redux
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redux → URL (skip initial render to avoid wiping URL before hydration completes)
  useEffect(() => {
    if (skipFirstSync.current) {
      skipFirstSync.current = false;
      return;
    }
    const params: Record<string, string> = {};
    if (state.q) params['q'] = state.q;
    if (state.sort !== 'updated_desc') params['sort'] = state.sort;
    if (state.view !== 'grid') params['view'] = state.view;
    for (const facet of FACET_IDS) {
      const vals = state.sets[facet];
      if (vals.length > 0) params[facet] = vals.join(',');
    }
    setSearchParams(params, { replace: true });
  }, [state.q, state.sort, state.view, state.sets, setSearchParams]);
}
