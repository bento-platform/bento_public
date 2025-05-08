import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import { TEXT_QUERY_PARAM } from './constants';
import type { QueryParams } from './types';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useQueryFilterFields = () => {
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => filterSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [filterSections]
  );
};

export const useNonFilterQueryParams = (): QueryParams => {
  const { textQuery } = useSearchQuery();
  return useMemo(() => ({ [TEXT_QUERY_PARAM]: textQuery }), [textQuery]);
};
