import { Row, Col } from 'antd';
import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
  return (
    <Row justify="center">
      <Col>
        <Spinner animation="border" />
      </Col>
    </Row>
  );
}

export default Loader;
