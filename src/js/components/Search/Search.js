import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
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
  };

  return (
    <Row justify="center">
      <Col style={{ width: '900px' }}>
        {searchSections.map((e, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <Typography.Title level={4}>{t(e.section_title)}</Typography.Title>
            <SearchFieldsStack key={i} queryFields={e.fields} />
          </div>
        ))}
        <Row justify="center">
          <Col className="text-center">
            <Button
              type="primary"
              onClick={queryKatsuPublic}
              size="large"
              shape="round"
              loading={isFetchingData}
              disabled={buttonDisabled}
              style={{ margin: '20px' }}
            >
              {t('Get Data')}
            </Button>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <SearchResults />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Search;
