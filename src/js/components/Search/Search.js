import React from 'react';
import { Row, Button, Typography, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeGetKatsuPublic } from '../../features/search/query';

import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

const Search = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const searchSections = useSelector((state) => state.query.querySections);
  const buttonDisabled = useSelector((state) => state.query.queryParamCount) === 0;
  const isFetchingData = useSelector((state) => state.query.isFetchingData);

  const queryKatsuPublic = () => {
    dispatch(makeGetKatsuPublic());
    // scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Row justify="center">
        <Space direction="vertical">
          <SearchResults />
          <Space direction="vertical" size="large">
            {searchSections.map((e, i) => (
              <div key={i}>
                <Typography.Title level={4}>{t(e.section_title)}</Typography.Title>
                <SearchFieldsStack key={i} queryFields={e.fields} queryKatsuPublicFunc={queryKatsuPublic}/>
              </div>
            ))}
          </Space>
        </Space>
      </Row>
    </>
  );
};

export default Search;
