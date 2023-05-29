import React from 'react';
import { useAppSelector } from '@/hooks';
import { serializeChartData } from '@/utils/chart';
import SearchResultsPane from '../Search/SearchResultsPane';

const BeaconSearchResults = () => {
  const { response } = useAppSelector((state) => state.beaconQuery);
  const individualCount = useAppSelector((state) => state.beaconQuery?.response?.responseSummary?.count);
  const isFetchingData = useAppSelector((state) => state.beaconQuery?.isFetchingQueryResponse);
  const hasInsufficientData = individualCount == 0;

  const { info } = response;

  const biosamples = info?.bento?.biosamples ?? {};
  const biosampleCount = biosamples.count;
  const biosampleChartData = serializeChartData(biosamples.sampled_tissue ?? []);

  const experiments = info?.bento?.experiments ?? {};
  const experimentCount = experiments.count ?? 0;
  const experimentChartData = serializeChartData(experiments?.experiment_type ?? []);

  // shown when count = 0
  const message = 'Insufficient data available.';

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
