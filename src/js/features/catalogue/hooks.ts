import { useMemo } from 'react';
import { useAppSelector, useTranslationFn } from '@/hooks';
import type { FacetOption } from '@/features/catalogue/types';
import { FACET_IDS, SORT_FNS, type DatasetWithProject, type FacetId } from './constants';
import { FACET_CONFIG_BY_ID } from './facetRegistry';
import { facetValueTranslationKey, getLabel } from './utils';

export type { DatasetWithProject } from './constants';

/** Selects the full catalogue slice from the Redux store. */
export function useCatalogueState() {
  return useAppSelector((state) => state.catalogue);
}

/**
 * Filters, sorts, and computes facet option counts for a list of datasets.
 *
 * Returns:
 * - `filtered` — datasets matching the current search query and all active facet selections, sorted by `sort`.
 * - `facetOptions(facetId)` — for each facet, the available values with their counts and selected state.
 *   Counts reflect items matching every *other* active filter (excluding the queried facet), so options
 *   stay live as the user drills down. Already-selected values are always included even if their count
 *   drops to zero so they can be deselected.
 */
export function useCatalogueFilter(items: DatasetWithProject[]): {
  filtered: DatasetWithProject[];
  facetOptions: (facetId: FacetId) => FacetOption[];
} {
  const t = useTranslationFn();
  const { q, sets, sort } = useCatalogueState();

  return useMemo(() => {
    const lowerQ = q.toLowerCase();

    /**
     * Returns true if `item` passes the current text query and all facet filters.
     * Pass `skipFacet` to exclude one facet from the check — used when computing
     * that facet's own option counts.
     */
    function matchesQuery(item: DatasetWithProject, skipFacet: FacetId | null): boolean {
      const { dataset } = item;
      if (lowerQ) {
        const kw = (dataset.keywords ?? []).map(getLabel).join(' ');
        const dom = (dataset.domain ?? []).join(' ');
        const hay = [dataset.title, dataset.description, dom, kw].join(' ').toLowerCase();
        if (!hay.includes(lowerQ)) return false;
      }
      for (const fid of FACET_IDS) {
        if (fid === skipFacet) continue;
        const selected = sets[fid];
        if (selected.length === 0) continue;
        const vals = FACET_CONFIG_BY_ID[fid].getValues(item);
        if (!vals.some((v) => selected.includes(v))) return false;
      }
      return true;
    }

    const filtered = items.filter((item) => matchesQuery(item, null));
    const sortedFiltered = [...filtered].sort(SORT_FNS[sort]);

    /** Computes display options for a single facet, respecting all other active filters. */
    function facetOptions(facetId: FacetId) {
      const facetConfig = FACET_CONFIG_BY_ID[facetId];

      const base = items.filter((item) => matchesQuery(item, facetId));
      const countMap = new Map<string, number>();
      for (const item of base) {
        for (const v of facetConfig.getValues(item)) {
          countMap.set(v, (countMap.get(v) ?? 0) + 1);
        }
      }

      const selected = sets[facetId];
      // include already-selected values even if count 0
      const allValues = new Set([...countMap.keys(), ...selected]);

      const values = [...allValues];
      const order = facetConfig.order;
      if (order) {
        values.sort((a, b) => {
          const ai = order.indexOf(a);
          const bi = order.indexOf(b);
          if (ai === -1 && bi === -1) return a.localeCompare(b);
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
      } else {
        values.sort((a, b) => (countMap.get(b) ?? 0) - (countMap.get(a) ?? 0) || a.localeCompare(b));
      }

      return values.map((v) => ({
        value: v,
        label: t(facetValueTranslationKey(facetConfig.i18nKeyPrefix, v)),
        count: countMap.get(v) ?? 0,
        selected: selected.includes(v),
      }));
    }

    return { filtered: sortedFiltered, facetOptions };
  }, [t, items, q, sets, sort]);
}
