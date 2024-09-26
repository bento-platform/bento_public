import { useAppSelector } from '@/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';

const BeaconSearchResults = () => {
  const isFetchingData = useAppSelector((state) => state.beaconQuery.isFetchingQueryResponse);
  const { individualCount, biosampleCount, biosampleChartData, experimentCount, experimentChartData } = useAppSelector(
    (state) => state.beaconQuery
  );
  const hasInsufficientData = individualCount === 0;
  const message = hasInsufficientData ? 'Insufficient data available.' : '';

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      message={message}
      individualCount={individualCount}
      biosampleCount={biosampleCount}
      biosampleChartData={biosampleChartData}
      experimentCount={experimentCount}
      experimentChartData={experimentChartData}
    />
  );
};

export default BeaconSearchResults;
