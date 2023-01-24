import React, {useState, useEffect} from 'react';
import { Row, Button, Typography, Space } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { useSelector,useDispatch  } from 'react-redux';
import { useTranslation } from 'react-i18next';


import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

import { makeGetKatsuPublic } from '../../features/search/query';

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const Search = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchSections = useSelector((state) => state.query.querySections);
  
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    window.onscroll = () => {
      window.pageYOffset > 0 ? setAtTop(false) : setAtTop(true);
    }

    return () => (window.onscroll = null);
  });

  useEffect(() => {
    dispatch(makeGetKatsuPublic());
  }, []);

  return (
    <>
      <Row justify="center">
        <Space direction="vertical" align="center">
          <SearchResults />
          <Space direction="vertical" size="large">
            {searchSections.map((e, i) => (
              <div key={i}>
                <Typography.Title level={4}>{t(e.section_title)}</Typography.Title>
                <SearchFieldsStack key={i} queryFields={e.fields} />
              </div>
            ))}
          </Space>
        </Space>
      </Row>
      <Button
        type="primary"
        onClick={scrollToTop}
        size="large"
        shape="round"
        className="floating-search"
        icon={<UpOutlined />}
        disabled={atTop}
      >
        {t('Back to top')}
      </Button>
    </>
  );
};

export default Search;
