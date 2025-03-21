import { useBeacon } from '@/features/beacon/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';
import { WAITING_STATES } from '@/constants/requests';

const BeaconSearchResults = () => {
  const { queryStatus, results } = useBeacon();
  const hasInsufficientData = results.individualCount === 0;
  const message = hasInsufficientData ? 'Insufficient data available.' : '';

  return (
    <SearchResultsPane
      isFetchingData={WAITING_STATES.includes(queryStatus)}
      hasInsufficientData={hasInsufficientData}
      message={message}
      results={results}
    />
  );
};

export default BeaconSearchResults;
