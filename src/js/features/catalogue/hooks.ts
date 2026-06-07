import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';
import type { FacetId } from './catalogue.store';

export interface DatasetWithProject {
  dataset: Dataset;
  project: Project;
}

export const getLabel = (v: string | { label: string }) => (typeof v === 'string' ? v : v.label);

export function getDatasetFacetValues({ dataset, project }: DatasetWithProject): Record<FacetId, string[]> {
  return {
    programs: [project.title],
    dataTypes: dataset.domain ?? [],
    assays: (() => {
      const raw = dataset.extra_properties?.['assays'];
      return typeof raw === 'string' ? [raw] : [];
    })(),
    organisms: (dataset.taxa ?? []).map(getLabel),
    access: dataset.privacy ? [dataset.privacy] : [],
    licenses: dataset.license?.type ? [dataset.license.type] : [],
    statuses: dataset.study_status ? [dataset.study_status] : [],
    keywords: (dataset.keywords ?? []).map(getLabel),
  };
}

const FACET_ORDER: Partial<Record<FacetId, string[]>> = {
  statuses: ['ONGOING', 'COMPLETED'],
  access: ['Open', 'Registered', 'Controlled'],
};

export function useCatalogueState() {
  return useAppSelector((state) => state.catalogue);
}

export function useCatalogueFilter(items: DatasetWithProject[]): {
  filtered: DatasetWithProject[];
  facetOptions: (facetId: FacetId) => { value: string; count: number; selected: boolean }[];
} {
  const { q, sets, sort } = useCatalogueState();

  return useMemo(() => {
    const lowerQ = q.toLowerCase();

    function matchesItem(item: DatasetWithProject, skipFacet: FacetId | null): boolean {
      const { dataset } = item;
      if (lowerQ) {
        const kw = (dataset.keywords ?? []).map(getLabel).join(' ');
        const dom = (dataset.domain ?? []).join(' ');
        const hay = [dataset.title, dataset.description, dom, kw].join(' ').toLowerCase();
        if (!hay.includes(lowerQ)) return false;
      }
      const facetIds: FacetId[] = ['programs', 'dataTypes', 'assays', 'organisms', 'access', 'licenses', 'statuses', 'keywords'];
      for (const fid of facetIds) {
        if (fid === skipFacet) continue;
        const selected = sets[fid];
        if (selected.length === 0) continue;
        const vals = getDatasetFacetValues(item)[fid];
        if (!vals.some((v) => selected.includes(v))) return false;
      }
      return true;
    }

    const filtered = items.filter((item) => matchesItem(item, null));

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

    function facetOptions(facetId: FacetId) {
      const base = items.filter((item) => matchesItem(item, facetId));
      const countMap = new Map<string, number>();
      for (const item of base) {
        for (const v of getDatasetFacetValues(item)[facetId]) {
          countMap.set(v, (countMap.get(v) ?? 0) + 1);
        }
      }
      const selected = sets[facetId];
      // include already-selected values even if count 0
      const allValues = new Set([...countMap.keys(), ...selected]);
      let values = [...allValues];
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
