import { useBeacon } from '@/features/beacon/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';

const BeaconSearchResults = () => {
  const { isFetchingQueryResponse: isFetchingData, results } = useBeacon();
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
