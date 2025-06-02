import { useBeacon } from '@/features/beacon/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';
import { WAITING_STATES } from '@/constants/requests';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';

const BeaconSearchResults = () => {
  const { queryStatus, results } = useBeacon();
  const uncensoredCounts = useCanSeeUncensoredCounts();
  const hasInsufficientData = results.individualCount === 0 && !uncensoredCounts;
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
