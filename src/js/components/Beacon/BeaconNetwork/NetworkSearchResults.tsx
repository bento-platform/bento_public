import { useMemo } from 'react';
import { Tag } from 'antd';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import SearchResultsPane from '../../Search/SearchResultsPane';
import { useBeaconNetwork } from '@/features/beacon/hooks';

const NetworkSearchResults = () => {
  const td = useTranslationDefault();

  const { hasBeaconNetworkError } = useBeaconNetwork();
  const { networkResults, beacons: responses } = useAppSelector((state) => state.beaconNetworkResponse);
  const responseArray = useMemo(() => Object.values(responses), [responses]);

  // filter() creates arrays we don't need, but the arrays are small
  // more readable than equivalent reduce() call
  const numNonErrorResponses = useMemo(
    () => responseArray.filter((r) => 'individualCount' in r.results).length,
    [responseArray]
  );
  const numNonZeroResponses = useMemo(
    () => responseArray.filter((r) => !!r.results.individualCount).length,
    [responseArray]
  );

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
    <SearchResultsPane
      isFetchingData={numNonErrorResponses == 0 && !hasBeaconNetworkError}
      results={networkResults}
      resultsTitle="Network Search Results"
      resultsExtra={resultsExtra}
    />
  );
};

export default NetworkSearchResults;
