import { useSearchQuery } from '@/features/search/hooks';
import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const {
    isFetchingData,
    biosampleCount,
    biosampleChartData,
    experimentCount,
    experimentChartData,
    individualCount,
    individualMatches,
    message,
  } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      message={message}
      individualCount={individualCount}
      individualMatches={individualMatches}
      biosampleCount={biosampleCount}
      biosampleChartData={biosampleChartData}
      experimentCount={experimentCount}
      experimentChartData={experimentChartData}
    />
  );
};

export default SearchResults;
