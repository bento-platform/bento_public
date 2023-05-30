import React from 'react';
import { useAppSelector } from '@/hooks';
import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const isFetchingData = useAppSelector((state) => state.query.isFetchingData);
  const biosampleCount = useAppSelector((state) => state.query.biosampleCount);
  const biosampleChartData = useAppSelector((state) => state.query.biosampleChartData);
  const experimentCount = useAppSelector((state) => state.query.experimentCount);
  const experimentChartData = useAppSelector((state) => state.query.experimentChartData);
  const individualCount = useAppSelector((state) => state.query.individualCount);
  const message = useAppSelector((state) => state.query.message);

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={message}
      message={message}
      individualCount={individualCount}
      biosampleCount={biosampleCount}
      biosampleChartData={biosampleChartData}
      experimentCount={experimentCount}
      experimentChartData={experimentChartData}
    />
  );

};

export default SearchResults;
