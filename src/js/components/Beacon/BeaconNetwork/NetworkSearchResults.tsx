import { Tag } from 'antd';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import SearchResultsPane from '../../Search/SearchResultsPane';
import { useBeaconNetwork } from '@/features/beacon/hooks';

const NetworkSearchResults = () => {
  const td = useTranslationDefault();

  const { hasBeaconNetworkError } = useBeaconNetwork();
  const responses = useAppSelector((state) => state.beaconNetworkResponse.beacons);
  const { individualCount, biosampleCount, experimentCount, biosampleChartData, experimentChartData } = useAppSelector(
    (state) => state.beaconNetworkResponse.networkResults
  );
  const responseArray = Object.values(responses);

  // filter() creates arrays we don't need, but the arrays are small
  // more readable than equivalent reduce() call
  const numNonErrorResponses = responseArray.filter((r) =>
    Object.prototype.hasOwnProperty.call(r, 'individualCount')
  ).length;
  const numNonZeroResponses = responseArray.filter((r) => r.individualCount).length;

  // show number of non-zero responses
  const numResultsText = (n: number) => {
    if (numNonErrorResponses) {
      return `${td('Results from')} ${n} beacon${n == 1 ? '' : 's'}`;
    }
    return '';
  };

  // results and optional error tag, for top-right "extra" section of results card
  // currently not possible to have both a network error and results, but this may change in the future
  const resultsExtra = (
    <>
      {hasBeaconNetworkError && <Tag color="red">Network Error</Tag>}
      {numResultsText(numNonZeroResponses)}
    </>
  );

  return (
    <>
      <SearchResultsPane
        isFetchingData={numNonErrorResponses == 0 && !hasBeaconNetworkError}
        hasInsufficientData={false}
        message={''}
        individualCount={individualCount}
        biosampleCount={biosampleCount}
        biosampleChartData={biosampleChartData}
        experimentCount={experimentCount}
        experimentChartData={experimentChartData}
        resultsTitle={'Network Search Results'}
        resultsExtra={resultsExtra}
      />
    </>
  );
};

export default NetworkSearchResults;
