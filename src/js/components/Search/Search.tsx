import { useCallback } from 'react';
import { Card, type CardProps, Flex, Row, Space } from 'antd';

import { useSearchQuery } from '@/features/search/hooks';
import { setQueryMode } from '@/features/search/query.store';
import { useAppDispatch } from '@/hooks';
import { useScopeQueryData } from '@/hooks/censorship';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import Loader from '@/components/Loader';
import OrDelimiter from './OrDelimiter';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';
import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { WAITING_STATES } from '@/constants/requests';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';

const SEARCH_CARD_STYLES: CardProps['styles'] = {
  ...CARD_STYLES,
  body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' },
};

export const SearchForm = () => {
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

const Search = () => {
  const { fieldsStatus } = useSearchQuery();
  useSearchRouterAndHandler();

  return WAITING_STATES.includes(fieldsStatus) ? (
    <Loader />
  ) : (
    <Row justify="center">
      <Space direction="vertical" align="center" className="w-full" styles={SPACE_ITEM_WIDTH_100P_STYLES}>
        <div className="container margin-auto">
          <SearchForm />
        </div>
        <SearchResults />
      </Space>
    </Row>
  );
};

export default Search;
