import { useAppSelector } from '@/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';

const BeaconSearchResults = () => {
  const { isFetchingQueryResponse: isFetchingData, results } = useAppSelector((state) => state.beaconQuery);
  const hasInsufficientData = results.individualCount === 0;
  const message = hasInsufficientData ? 'Insufficient data available.' : '';

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      message={message}
      results={results}
    />
  );
};

export default BeaconSearchResults;
