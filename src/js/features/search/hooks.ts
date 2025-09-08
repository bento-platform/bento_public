import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import { TEXT_QUERY_PARAM } from './constants';
import type { QueryFilterField, QueryParams } from './types';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useQueryFilterFields = (): QueryFilterField[] => {
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => filterSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [filterSections]
  );
};

export const useNonFilterQueryParams = (): QueryParams => {
  const { textQuery } = useSearchQuery();
  return useMemo<QueryParams>(() => {
    const qp: QueryParams = {};
    if (textQuery) {
      // Only include text query parameter if textQuery is set to a non-false value.
      qp[TEXT_QUERY_PARAM] = textQuery;
    }
    return qp;
  }, [textQuery]);
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
