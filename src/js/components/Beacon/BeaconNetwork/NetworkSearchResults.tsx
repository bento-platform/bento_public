import React from 'react';
import { useAppSelector } from '@/hooks';
import SearchResultsPane from '../../Search/SearchResultsPane';

const NetworkSearchResults = () => {
  const responses = useAppSelector((state) => state.beaconNetworkResponse.beacons);
  const networkResults = useAppSelector((state) => state.beaconNetworkResponse.networkResults);
  // can destructure above
  const { individualCount, biosampleCount, experimentCount, biosampleChartData, experimentChartData } = networkResults;
  const responseArray = Object.values(responses);

  // filter() creates arrays we don't need, but arrays are small
  // more readable than equivalent reduce() call
  const numGoodResponses = responseArray.filter((r) =>
    Object.prototype.hasOwnProperty.call(r, 'individualCount')
  ).length;
  const numNonZeroResponses = responseArray.filter((r) => r.individualCount).length;

  const extraText =
    numGoodResponses > 0 ? `results from ${numNonZeroResponses} beacon${numNonZeroResponses == 1 ? '' : 's'}` : '';

  return (
    <>
      <SearchResultsPane
        isFetchingData={numGoodResponses == 0}
        hasInsufficientData={false}
        message={''}
        individualCount={individualCount}
        biosampleCount={biosampleCount}
        biosampleChartData={biosampleChartData}
        experimentCount={experimentCount}
        experimentChartData={experimentChartData}
        resultsTitle={'Network Search Results'}
        resultsExtra={extraText}
      />
    </>
  );
};

export default NetworkSearchResults;
