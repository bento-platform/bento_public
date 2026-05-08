import { Card, type CardProps, Divider, Flex } from 'antd';

import { useScopeQueryData } from '@/hooks/censorship';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

import { CARD_BODY_STYLE, CARD_STYLES } from '@/constants/beaconConstants';

const SEARCH_CARD_STYLES: CardProps['styles'] = {
  ...CARD_STYLES,
  body: { ...CARD_BODY_STYLE, padding: '20px 24px 24px 24px' },
};

const SearchFormInner = ({ vertical }: { vertical: boolean }) => {
  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useScopeQueryData();

  const subFormStyle = vertical ? { padding: isSmallScreen ? 10 : 24 } : undefined;

  return (
    <Flex
      justify="space-between"
      gap={vertical ? 0 : isSmallScreen ? 12 : 24}
      className="w-full"
      vertical={vertical || isSmallScreen}
    >
      {queryDataPerm && (
        // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
        // the data, so show the free-text search form:
        <>
          <SearchFreeText vertical={vertical} style={subFormStyle} />
          {vertical ? <Divider className="m-0" /> : null}
        </>
      )}
      <SearchFilters className="max-w-half-cmw" vertical={vertical} style={subFormStyle} />
    </Flex>
  );
};

const SearchForm = ({ vertical }: { vertical?: boolean }) => {
  return vertical ? (
    <SearchFormInner vertical={vertical} />
  ) : (
    <Card className="w-full shadow rounded-xl" styles={SEARCH_CARD_STYLES}>
      <SearchFormInner vertical={false} />
    </Card>
  );
};

export default SearchForm;
