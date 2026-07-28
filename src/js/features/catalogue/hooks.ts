import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import type { StudyContext } from '@/types/dataset';
import { FACET_IDS, FACET_ORDER, SORT_FNS, type DatasetWithProject, type FacetId } from './constants';

export type { DatasetWithProject } from './constants';

/** Extracts a display string from a plain string or labelled object. */
export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

/** Normalises raw study_status values to display strings. */
export function normaliseStatus(raw: string | undefined | null): string {
  if (raw === 'ONGOING') return 'Ongoing';
  if (raw === 'COMPLETED') return 'Completed';
  return 'Unassigned';
}

/** Builds the i18n key for a normalised status value, e.g., "Unassigned" -> "provenance.status.unassigned". */
export const statusTranslationKey = (status: string): string => `provenance.status.${status.toLowerCase()}`;

/** Builds the i18n key for a normalised study context value, e.g., "Clinical" -> "provenance.context.clinical". */
export const studyContextTranslationKey = (context: StudyContext): string =>
  `provenance.context.${context.toLowerCase()}`;

/** Builds the i18n key for a facet's label, e.g., "dataTypes" -> "catalogue.facets.dataTypes". */
export const facetTranslationKey = (facet: FacetId): string => `catalogue.facets.${facet}`;

/** Ordered colour palette used to assign a stable colour per project name. */
export const PALETTE = ['#1677FF', '#13C2C2', '#722ED1', '#FA8C16', '#52C41A'];

/**
 * Assigns a deterministic colour from {@link PALETTE} to each project name.
 * Names are sorted alphabetically before assignment so order is stable across renders.
 */
export function assignColors(names: string[]): Record<string, string> {
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  return Object.fromEntries(sorted.map((name, i) => [name, PALETTE[i % PALETTE.length]]));
}

/** Returns the filterable string values for each facet dimension of a dataset. */
export function getDatasetFacetValues({ dataset, project }: DatasetWithProject): Record<FacetId, string[]> {
  return {
    projects: [project.title],
    dataTypes: dataset.domain ?? [],
    taxa: (dataset.taxa ?? []).map(getLabel),
    access: dataset.privacy ? [dataset.privacy] : [],
    licenses: dataset.license?.type ? [dataset.license.type] : [],
    statuses: [normaliseStatus(dataset.study_status)],
    keywords: (dataset.keywords ?? []).map(getLabel),
  };
}

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
  facetOptions: (facetId: FacetId) => { value: string; count: number; selected: boolean }[];
} {
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
        const vals = getDatasetFacetValues(item)[fid];
        if (!vals.some((v) => selected.includes(v))) return false;
      }
      return true;
    }

    const filtered = items.filter((item) => matchesQuery(item, null));
    const sortedFiltered = [...filtered].sort(SORT_FNS[sort]);

    /** Computes display options for a single facet, respecting all other active filters. */
    function facetOptions(facetId: FacetId) {
      const base = items.filter((item) => matchesQuery(item, facetId));
      const countMap = new Map<string, number>();
      for (const item of base) {
        for (const v of getDatasetFacetValues(item)[facetId]) {
          countMap.set(v, (countMap.get(v) ?? 0) + 1);
        }
      }
      const selected = sets[facetId];
      // include already-selected values even if count 0
      const allValues = new Set([...countMap.keys(), ...selected]);
      const values = [...allValues];
      const order = FACET_ORDER[facetId];
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
        count: countMap.get(v) ?? 0,
        selected: selected.includes(v),
      }));
    }

    return { filtered: sortedFiltered, facetOptions };
  }, [items, q, sets, sort]);
}
