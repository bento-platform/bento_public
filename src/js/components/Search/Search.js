import React, { useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addQueryableFields, makeGetKatsuPublic } from '../../features/query';
import SearchFieldsStack from './searchFieldsStack';

const Search = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.data.fields);

  // Update queryable fields
  useEffect(() => {
    dispatch(addQueryableFields(fields));
  }, []);

  const queryKatsuPublic = () => {
    dispatch(makeGetKatsuPublic());
  };

  const { queryResponseData, isFetchingData, queryParameterStack } =
    useSelector((state) => state.query);

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
            variant="primary"
            onClick={queryKatsuPublic}
            disabled={isFetchingData}
          >
            Get Data
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {/* <SearchResults
            queryResponseData={queryResponseData}
            isFetchingData={isFetchingData}
          /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
