import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Descriptions, Row, Typography } from 'antd';
const { Item } = Descriptions;

import { toTitleCase } from '../../utils/string';

const ProvenanceTab = () => {
  const metadata = useSelector((state) => state.data.metadata);
  return (
    <div className="container">
      <Row justify="center">
        <Col>
          {metadata.map((dataset, index) => (
            <Descriptions
              key={index}
              title={
                <Typography.Title level={3} italic>
                  Provenance of "{dataset.title}"
                </Typography.Title>
              }
            >
              {Object.entries(dataset).map(([key, value], i) => (
                <Item key={i} label={<b>{toTitleCase(key)}</b>}>
                  {value || '-'}
                </Item>
              ))}
            </Descriptions>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ProvenanceTab;
