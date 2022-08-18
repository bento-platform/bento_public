import React from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import DatasetProvenance from './DatasetProvenance';

const ProvenanceTab = () => {
  const datasets = useSelector((state) => state.data.metadata);

  return (
    <div className="container">
      <Row justify="center">
        <Col>
          {datasets.map((dataset, i) => (
            <DatasetProvenance key={i} metadata={dataset} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ProvenanceTab;
