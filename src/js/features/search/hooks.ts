import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useQueryFilterFields = () => {
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => filterSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [filterSections]
  );
};
