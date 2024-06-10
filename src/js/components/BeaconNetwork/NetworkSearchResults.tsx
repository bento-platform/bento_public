import React from 'react';
import { useAppSelector } from '@/hooks';
import SearchResultsPane from '../Search/SearchResultsPane';


const NetworkSearchResults = () => {
  const responses = useAppSelector((state) => state.beaconNetworkResponse.beacons)
  const networkResults = useAppSelector((state) => state.beaconNetworkResponse.networkResults)
  // can destructure above
  const {individualCount, biosampleCount, experimentCount, biosampleChartData, experimentChartData} = networkResults

  return (
    < >
      <SearchResultsPane
        isFetchingData={false}
        hasInsufficientData={false}
        message={''}
        individualCount={individualCount}
        biosampleCount={biosampleCount}
        biosampleChartData={biosampleChartData}
        experimentCount={experimentCount}
        experimentChartData={experimentChartData}
      />
    </>
  );
};

export default NetworkSearchResults;
