import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import { ENTITY_QUERY_PARAM, TABLE_PAGE_QUERY_PARAM, TABLE_PAGE_SIZE_QUERY_PARAM, TEXT_QUERY_PARAM } from './constants';
import type { QueryFilterField, QueryParams } from './types';
import { bentoKatsuEntityToResultsDataEntity } from './utils';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useQueryFilterFields = (): QueryFilterField[] => {
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => filterSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [filterSections]
  );
};

export const useNonFilterQueryParams = (): QueryParams => {
  const { selectedEntity, matchData, pageSize, textQuery } = useSearchQuery();
  return useMemo<QueryParams>(() => {
    const qp: QueryParams = {};

    if (selectedEntity) {
      qp[ENTITY_QUERY_PARAM] = selectedEntity;
      qp[TABLE_PAGE_QUERY_PARAM] = matchData[bentoKatsuEntityToResultsDataEntity(selectedEntity)].page.toString();
    }

    qp[TABLE_PAGE_SIZE_QUERY_PARAM] = pageSize.toString();

    if (textQuery) {
      // Only include text query parameter if textQuery is set to a non-false value.
      qp[TEXT_QUERY_PARAM] = textQuery;
    }

    return qp;
  }, [selectedEntity, matchData, pageSize, textQuery]);
};

/**
 * Combines filterQueryParams and other query params that relate to the search slice into a single query param object.
 */
export const useSearchQueryParams = (): QueryParams => {
  const { filterQueryParams } = useSearchQuery();
  const otherQueryParams = useNonFilterQueryParams();
  return useMemo(() => ({ ...filterQueryParams, ...otherQueryParams }), [filterQueryParams, otherQueryParams]);
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
