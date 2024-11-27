import { useMemo } from 'react';
import { useSearchQuery } from '@/features/search/hooks';

export const useSearchableFields = () => {
  /**
   * Hook which calculates a set of searchable fields (which share IDs with charts), which can be used, for example, to
   * choose whether to add a click event to a chart for the field.
   */
  const { querySections } = useSearchQuery();
  return useMemo(
    () => new Set(querySections.flatMap((section) => section.fields).map((field) => field.id)),
    [querySections]
  );
};
