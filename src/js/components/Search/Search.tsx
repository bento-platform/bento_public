import { Row, Space } from 'antd';

import { useSearchQuery } from '@/features/search/hooks';

import Loader from '@/components/Loader';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

import { SPACE_ITEM_WIDTH_100P_STYLES } from '@/constants/common';
import { WAITING_STATES } from '@/constants/requests';
import { useSearchRouterAndHandler } from '@/hooks/useSearchRouterAndHandler';

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
