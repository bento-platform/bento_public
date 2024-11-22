import { useSearchQuery } from '@/features/search/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const { isFetchingData, message, results } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  const uncensoredCounts = useCanSeeUncensoredCounts();

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      uncensoredCounts={uncensoredCounts}
      message={message}
      results={results}
    />
  );
};

export default SearchResults;
