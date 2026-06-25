import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';
import { FACET_IDS, FACET_ORDER, type FacetId } from './constants';

/** A dataset paired with its parent project. */
export interface DatasetWithProject {
  dataset: Dataset;
  project: Project;
}

/** Extracts a display string from a plain string or labelled object. */
export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

/** Normalises raw study_status values to display strings. */
export function normaliseStatus(raw: string | undefined | null): string {
  if (raw === 'ONGOING') return 'Ongoing';
  if (raw === 'COMPLETED') return 'Completed';
  return 'Unassigned';
}

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

    const sortedFiltered = [...filtered].sort((a, b) => {
      const da = a.dataset;
      const db = b.dataset;
      if (sort === 'updated_desc') return (db.last_modified ?? '').localeCompare(da.last_modified ?? '');
      if (sort === 'created_desc') return (db.release_date ?? '').localeCompare(da.release_date ?? '');
      if (sort === 'title_az') return da.title.localeCompare(db.title);
      if (sort === 'individuals_desc') {
        const ai = typeof da.counts_by_entity?.individual === 'number' ? da.counts_by_entity.individual : 0;
        const bi = typeof db.counts_by_entity?.individual === 'number' ? db.counts_by_entity.individual : 0;
        return bi - ai;
      }
      if (sort === 'biosamples_desc') {
        const ab = typeof da.counts_by_entity?.biosample === 'number' ? da.counts_by_entity.biosample : 0;
        const bb = typeof db.counts_by_entity?.biosample === 'number' ? db.counts_by_entity.biosample : 0;
        return bb - ab;
      }
      return 0;
    });

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
