import type { KatsuEntityCountsOrBooleans } from '@/types/entities';

export const emptyCounts = (c: KatsuEntityCountsOrBooleans | null | undefined) => {
  const values = Object.values(c ?? {});
  return values.length === 0 || values.every((c) => !c);
};
