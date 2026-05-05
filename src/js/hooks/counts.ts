import { useConfig } from '@/features/config/hooks';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import { useLanguage } from '@/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

/**
 * Renders count values with censorship rules:
 * - boolean true → ">${threshold}" (censored data exists)
 * - boolean false/undefined/zero (without permission) → dashes
 * - number → the count value
 */
export const renderCountValue = (
  locale: string,
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

  return Intl.NumberFormat(locale).format(count);
};

/** Hook that wraps renderCountValue with threshold and permissions from Redux state. */
export const useRenderCount = () => {
  const { countThreshold } = useConfig();
  const uncensoredCounts = useCanSeeUncensoredCounts();
  const language = useLanguage();

  return (count: number | boolean | undefined) => renderCountValue(language, count, countThreshold, uncensoredCounts);
};
