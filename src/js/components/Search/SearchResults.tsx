import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import type { SearchResultsUIPage } from '@/features/search/types';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';
import { RequestStatus } from '@/types/requests';
import { langAndScopeSelectionToUrl } from '@/utils/router';

import SearchResultsPane from './SearchResultsPane';

const SearchResults = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  let { page: subPage } = useParams();
  const selectedScope = useSelectedScope();

  subPage = subPage ?? 'charts';

  const handlePageChange = useCallback(
    (newPage?: SearchResultsUIPage) => {
      navigate(
        langAndScopeSelectionToUrl(
          language,
          selectedScope,
          `search${newPage ? '/' + newPage : ''}${location.search}${location.hash}`
        ),
        { replace: true }
      );
    },
    [location, navigate, language, selectedScope]
  );

  useEffect(() => {
    if (!['charts', 'individuals'].includes(subPage)) {
      // if invalid search UI page, go to charts (but keep URL clean, so use blank for charts default):
      handlePageChange(undefined);
    }
  }, [handlePageChange, subPage]);

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
      page={subPage as SearchResultsUIPage}
      onPageChange={handlePageChange}
    />
  );
};

export default SearchResults;
