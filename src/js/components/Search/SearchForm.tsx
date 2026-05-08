import { Divider, Flex } from 'antd';

import { useScopeQueryData } from '@/hooks/censorship';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import SearchFilters from './SearchFilters';
import SearchFreeText from './SearchFreeText';

const SearchForm = () => {
  const isSmallScreen = useSmallScreen();
  const { hasPermission: queryDataPerm } = useScopeQueryData();

  const subFormStyle = { padding: isSmallScreen ? 10 : 24 };

  return (
    <Flex justify="space-between" className="w-full" vertical>
      {queryDataPerm && (
        // If we have the query:data permission on the current scope, we're allowed to run free-text searches on
        // the data, so show the free-text search form:
        <>
          <SearchFreeText style={subFormStyle} />
          <Divider className="m-0" />
        </>
      )}
      <SearchFilters className="max-w-half-cmw" style={subFormStyle} />
    </Flex>
  );
};

export default SearchForm;
