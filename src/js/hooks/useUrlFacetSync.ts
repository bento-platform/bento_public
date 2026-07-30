import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface ScalarParam<T extends string> {
  /** Query-string key, e.g. "sort". */
  key: string;
  defaultValue: T;
  validValues: readonly T[];
}

export interface UrlFacetHydrate<FacetId extends string> {
  q: string;
  sets: Record<FacetId, string[]>;
  scalars: Record<string, string>;
}

/**
 * Parses facet sets (repeated-key params, e.g. ?statuses=Ongoing&statuses=Completed) and scalar
 * params (e.g. ?sort=title_az) out of the URL on mount and on every subsequent navigation, and
 * hands the parsed result to `onHydrate`. The URL is the source of truth; callers write the
 * result into their own store rather than dispatching filter changes directly.
 *
 * `facetIds` and `scalars` must be stable references (module-level constants) since they're
 * effect dependencies; `onHydrate` should be a stable callback (e.g. `dispatch(hydrateFromUrl(...))`
 * wrapped in `useCallback`, or the dispatch function itself).
 */
export function useUrlFacetSync<FacetId extends string>(
  facetIds: readonly FacetId[],
  scalars: Record<string, ScalarParam<string>>,
  onHydrate: (parsed: UrlFacetHydrate<FacetId>) => void
) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sets = Object.fromEntries(facetIds.map((id) => [id, searchParams.getAll(id)])) as Record<FacetId, string[]>;
    const parsedScalars = Object.fromEntries(
      Object.entries(scalars).map(([name, cfg]) => {
        const raw = searchParams.get(cfg.key);
        return [name, raw !== null && cfg.validValues.includes(raw) ? raw : cfg.defaultValue];
      })
    );
    onHydrate({ q: searchParams.get('q') ?? '', sets, scalars: parsedScalars });
  }, [searchParams, facetIds, scalars, onHydrate]);
}
