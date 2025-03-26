import { useState } from 'react';
import { useSearchQuery } from '@/features/search/hooks';
import type { SearchResultsUIPane } from '@/features/search/types';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';
import { RequestStatus } from '@/types/requests';

import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const [pane, setPane] = useState<SearchResultsUIPane>('charts');
  const { filterQueryStatus, textQueryStatus, message, results } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  const uncensoredCounts = useCanSeeUncensoredCounts();

  return (
    <SearchResultsPane
      isFetchingData={filterQueryStatus === RequestStatus.Pending || textQueryStatus === RequestStatus.Pending}
      hasInsufficientData={hasInsufficientData}
      uncensoredCounts={uncensoredCounts}
      message={message}
      results={results}
      pane={pane}
      onPaneChange={setPane}
    />
  );
};

export default SearchResults;
