import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

/**
 * Renders count values with censorship rules:
 * - boolean true → ">${threshold}" (censored data exists)
 * - boolean false/undefined/zero (without permission) → dashes
 * - number → the count value
 */
export const renderCountValue = (
  count: number | boolean | undefined,
  threshold: number,
  uncensoredCounts: boolean
): number | string => {
  if (count === undefined) {
    return NO_RESULTS_DASHES;
  }

  if (typeof count === 'boolean') {
    return count ? `>${threshold}` : NO_RESULTS_DASHES;
  }

  if (count === 0) {
    return uncensoredCounts ? count : NO_RESULTS_DASHES;
  }

  return count;
};

/** Hook that wraps renderCountValue with threshold and permissions from Redux state. */
export const useRenderCount = () => {
  const { countThreshold } = useConfig();
  const uncensoredCounts = useCanSeeUncensoredCounts();

  return (count: number | boolean | undefined) => renderCountValue(count, countThreshold, uncensoredCounts);
};
