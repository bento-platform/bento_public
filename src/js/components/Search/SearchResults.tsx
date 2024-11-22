import { useSearchQuery } from '@/features/search/hooks';
import SearchResultsPane from './SearchResultsPane';
import { useSelectedScopeAsResource } from '@/features/metadata/hooks';
import { useHasResourcePermissionWrapper } from '@/hooks';
import { queryData } from 'bento-auth-js';

const SearchResults = () => {
  const { isFetchingData, message, results } = useSearchQuery();

  // existing code treats non-empty message as sign of insufficient data
  const hasInsufficientData = message !== '';

  const scopeResource = useSelectedScopeAsResource();
  const { hasPermission: queryDataPerm } = useHasResourcePermissionWrapper(scopeResource, queryData);

  return (
    <SearchResultsPane
      isFetchingData={isFetchingData}
      hasInsufficientData={hasInsufficientData}
      uncensoredCounts={queryDataPerm}
      message={message}
      results={results}
    />
  );
};

export default SearchResults;
