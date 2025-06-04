import { useMemo } from 'react';
import { useSearchQuery } from '@/features/search/hooks';
import { useAppSelector } from '@/hooks';

export const useData = () => useAppSelector((state) => state.data);

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
