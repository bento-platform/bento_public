import { WAITING_STATES } from '@/constants/requests';
import { useSearchQuery } from '@/features/search/hooks';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const { dataStatus, message, results } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  const uncensoredCounts = useCanSeeUncensoredCounts();

  return (
    <SearchResultsPane
      isFetchingData={WAITING_STATES.includes(dataStatus)}
      hasInsufficientData={hasInsufficientData}
      uncensoredCounts={uncensoredCounts}
      message={message}
      results={results}
    />
  );
};

export default SearchResults;
