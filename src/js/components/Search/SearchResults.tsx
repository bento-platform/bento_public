import { useSearchQuery } from '@/features/search/hooks';
import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const { isFetchingData, message, results } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      message={message}
      results={results}
    />
  );
};

export default SearchResults;
