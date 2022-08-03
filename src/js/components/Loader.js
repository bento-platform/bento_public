import { Row, Col, Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import React from 'react';

const Loader = () => {
  return (
    <Row justify="center">
      <Col>
        <Spin indicator={<Loading3QuartersOutlined style={{ fontSize: 40 }} spin />} />
      </Col>
    </Row>
  );
};

export default Loader;
