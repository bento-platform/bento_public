import type { KatsuEntityCountsOrBooleans } from '@/types/entities';

export const nonEmptyCounts = (c: KatsuEntityCountsOrBooleans | null | undefined) => {
  const values = Object.values(c ?? {});
  if (values.length === 0) return false;
  return values.some((c) => !!c);
};
