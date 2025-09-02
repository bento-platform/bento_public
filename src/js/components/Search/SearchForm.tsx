import { useCallback } from 'react';
import { Card, type CardProps, Flex } from 'antd';

import { useSearchQuery } from '@/features/search/hooks';
import { setQueryMode } from '@/features/search/query.store';
import { useAppDispatch } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import OrDelimiter from './OrDelimiter';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';

const SEARCH_CARD_STYLES: CardProps['styles'] = {
  ...CARD_STYLES,
  body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' },
};

const SearchForm = () => {
  const dispatch = useAppDispatch();

  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { mode: queryMode } = useSearchQuery();

  const onFiltersFocus = useCallback(() => dispatch(setQueryMode('filters')), [dispatch]);
  const onTextFocus = useCallback(() => dispatch(setQueryMode('text')), [dispatch]);

  return (
    <Card className="w-full shadow rounded-xl" styles={SEARCH_CARD_STYLES}>
      <Flex justify="space-between" gap={isSmallScreen ? 12 : 24} className="w-full" vertical={isSmallScreen}>
        <SearchFilters focused={queryMode === 'filters'} onFocus={onFiltersFocus} className="max-w-half-cmw" />
        {queryDataPerm && (
          // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
          // the data, so show the free-text search form:
          <>
            <OrDelimiter vertical={!isSmallScreen} />
            <SearchFreeText focused={queryMode === 'text'} onFocus={onTextFocus} />
          </>
        )}
      </Flex>
    </Card>
  );
};

export default SearchForm;
