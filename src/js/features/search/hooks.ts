import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import type { ActiveFilterPill } from '@/components/Util/ActiveFilterTags';
import {
  ENTITY_QUERY_PARAM,
  TABLE_PAGE_QUERY_PARAM,
  TABLE_PAGE_SIZE_QUERY_PARAM,
  TEXT_QUERY_PARAM,
  TEXT_QUERY_TYPE_PARAM,
} from './constants';
import type { QueryParamEntries, SearchFieldAndOptions } from './types';
import {
  bentoKatsuEntityToResultsDataEntity,
  buildQueryParamsUrl,
  combineQueryParamsWithoutKey,
  filtersStateToQueryParamEntries,
} from './utils';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useSearchFilterFields = (): SearchFieldAndOptions[] => {
  const { filterSections } = useSearchQuery();
  return useMemo(() => filterSections.flatMap(({ fields }) => fields), [filterSections]);
};

export const useEntityAndTextQueryParams = (): QueryParamEntries => {
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { selectedEntity, matchData, pageSize, textQuery, textQueryType } = useSearchQuery();
  return useMemo<QueryParamEntries>(() => {
    const qp: QueryParamEntries = [];

    if (selectedEntity) {
      qp.push(
        [ENTITY_QUERY_PARAM, selectedEntity],
        [TABLE_PAGE_QUERY_PARAM, matchData[bentoKatsuEntityToResultsDataEntity(selectedEntity)].page.toString()]
      );
    }

    if (queryDataPerm) {
      // only include the page size and text query type parameters if we're authorized to view results tables.
      // both of these control select dropdowns and so keeping their value even without a selected entity (pageSize)
      // / text searching (textQueryType) is more intuitive to preserve the UI state.
      qp.push([TABLE_PAGE_SIZE_QUERY_PARAM, pageSize.toString()], [TEXT_QUERY_TYPE_PARAM, textQueryType]);
    }

    if (textQuery) {
      // Only include text query parameter if textQuery is set to a non-false value.
      qp.push([TEXT_QUERY_PARAM, textQuery]);
    }

    return qp;
  }, [selectedEntity, matchData, pageSize, queryDataPerm, textQuery, textQueryType]);
};

/**
 * Combines filters and other query params that relate to the search slice into a single query param object.
 */
export const useSearchQueryParams = (): QueryParamEntries => {
  const { filters } = useSearchQuery();
  const otherQueryParams = useEntityAndTextQueryParams();
  return useMemo(() => [...filtersStateToQueryParamEntries(filters), ...otherQueryParams], [filters, otherQueryParams]);
};

/**
 * Active-filter pills (for display outside the sidebar, e.g. between the About section and the count
 * cards on the overview page) plus the actions to remove one filter value or clear all filters. Shared
 * with SearchFilters (the sidebar's own filter-editing form) so both surfaces navigate the URL the same way.
 */
export const useActiveFilterPills = (): { pills: ActiveFilterPill[]; clearAll: () => void } => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { filters } = useSearchQuery();
  const fields = useSearchFilterFields();
  const entityAndTextQueryParams = useEntityAndTextQueryParams();

  const clearAll = useCallback(() => {
    const url = buildQueryParamsUrl(pathname, entityAndTextQueryParams);
    navigate(url, { replace: true });
  }, [pathname, entityAndTextQueryParams, navigate]);

  const removeFilterValue = useCallback(
    (field: string, value: string) => {
      const oldValue = filters[field];
      const remaining = Array.isArray(oldValue) ? oldValue.filter((v) => v !== value) : [];
      const resetPage = entityAndTextQueryParams.find(([k, _]) => k === TABLE_PAGE_QUERY_PARAM)
        ? ([[TABLE_PAGE_QUERY_PARAM, '0']] as QueryParamEntries)
        : [];

      if (Array.isArray(oldValue) && remaining.length > 0) {
        // Keep the field, drop just this one value.
        const existingFiltersQP = filtersStateToQueryParamEntries(filters, true).filter(
          ([k, v]) => k !== field || remaining.includes(v)
        );
        const url = buildQueryParamsUrl(pathname, [...existingFiltersQP, ...entityAndTextQueryParams, ...resetPage]);
        navigate(url, { replace: true });
        return;
      }

      // Single value, or the last remaining array value: drop the field entirely.
      const filtersStateAsQueryParams = filtersStateToQueryParamEntries(filters, true);
      const url = buildQueryParamsUrl(
        pathname,
        combineQueryParamsWithoutKey(filtersStateAsQueryParams, [...entityAndTextQueryParams, ...resetPage], [field])
      );
      navigate(url, { replace: true });
    },
    [filters, entityAndTextQueryParams, pathname, navigate]
  );

  const pills = useMemo(() => {
    const p: ActiveFilterPill[] = [];
    Object.entries(filters).forEach(([field, value]) => {
      if (value === null || value === undefined) return;
      const facetLabel = fields.find((f) => f.id === field)?.definition.title ?? field;
      const values = Array.isArray(value) ? value : value ? [value] : [];
      values.forEach((v) => {
        if (!v) return;
        p.push({ key: `${field}-${v}`, facetLabel, label: v, onClose: () => removeFilterValue(field, v) });
      });
    });
    return p;
  }, [filters, fields, removeFilterValue]);

  return { pills, clearAll };
};

export const useSearchableFields = () => {
  /**
   * Hook which calculates a set of searchable fields (which share IDs with charts), which can be used, for example, to
   * choose whether to add a click event to a chart for the field.
   */
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => new Set(filterSections.flatMap((section) => section.fields).map((field) => field.id)),
    [filterSections]
  );
};
