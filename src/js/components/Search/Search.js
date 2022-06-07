import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addQueryableFields, makeGetKatsuPublic } from '../../features/query';
import SearchFieldsStack from './SearchFieldsStack';
import SearchResults from './SearchResults';

const Search = () => {
  const dispatch = useDispatch();

  const queryKatsuPublic = () => {
    dispatch(makeGetKatsuPublic());
  };

  const buttonDisabled =
    useSelector((state) => state.query.queryParamCount) === 0;

  const isFetchingData = useSelector((state) => state.query.isFetchingData);

  return (
    <Container>
      <Row>
        <Col sm={{ span: 10 }}>
          <SearchFieldsStack />
        </Col>
      </Row>
      <Row>
        <Col
          className="text-center"
          xs={{ span: 4, offset: 4 }}
          md={{ span: 6, offset: 3 }}
        >
          <Button
            type="primary"
            onClick={queryKatsuPublic}
            size="large"
            shape="round"
            loading={isFetchingData}
            disabled={buttonDisabled}
            style={{ margin: '10px' }}
          >
            Get Data
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <SearchResults />
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
