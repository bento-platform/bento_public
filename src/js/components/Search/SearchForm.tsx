import { Divider, Flex } from 'antd';

import { useScopeQueryData } from '@/hooks/censorship';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

const SearchForm = () => {
  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useScopeQueryData();

  return (
    <Flex justify="space-between" className="w-full" vertical gap={isSmallScreen ? 2 : 4}>
      {queryDataPerm && (
        // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
        // the data, so show the free-text search form:
        <>
          <SearchFreeText />
          <Divider className="m-0" />
        </>
      )}
      <SearchFilters className="max-w-half-cmw" />
    </Flex>
  );
};

export default SearchForm;
