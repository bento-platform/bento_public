import React, { useEffect } from 'react';
import { Row, Typography, Space, FloatButton } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

import { makeGetKatsuPublic } from '@/features/search/query.store';
import { NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';

const Search = () => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const dispatch = useDispatch();
  const searchSections = useAppSelector((state) => state.query.querySections);

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
      <FloatButton.BackTop />
    </>
  );
};

export default Search;
