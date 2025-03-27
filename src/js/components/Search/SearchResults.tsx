import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import type { SearchResultsUIPane } from '@/features/search/types';
import { useCanSeeUncensoredCounts } from '@/hooks/censorship';
import { RequestStatus } from '@/types/requests';

import SearchResultsPane from './SearchResultsPane';
import { langAndScopeSelectionToUrl } from '@/utils/router';
import { useCallback, useEffect } from 'react';

const SearchResults = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  let { pane } = useParams();
  const selectedScope = useSelectedScope();

  pane = pane ?? 'charts';

  const handlePaneChange = useCallback(
    (newPane?: SearchResultsUIPane) => {
      navigate(
        langAndScopeSelectionToUrl(
          language,
          selectedScope,
          `search${newPane ? '/' + newPane : ''}${location.search}${location.hash}`
        ),
        { replace: true }
      );
    },
    [location, navigate, language, selectedScope]
  );

  useEffect(() => {
    if (!['charts', 'individuals'].includes(pane)) {
      // if invalid pane, go to charts (but keep URL clean, so use blank for charts default):
      handlePaneChange(undefined);
    }
  }, [handlePaneChange, pane]);

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
      pane={pane as SearchResultsUIPane}
      onPaneChange={handlePaneChange}
    />
  );
};

export default SearchResults;
