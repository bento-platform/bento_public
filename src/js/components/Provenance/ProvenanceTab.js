import React from 'react';
import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import DatasetProvenance from './DatasetProvenance';

const ProvenanceTab = () => {
  const { data, isFetching: loading } = useSelector((state) => state.provenance);

  return (
    <div className="container">
      <Row justify="center">
        <Col>
          {data.map((dataset, i) => (
            <DatasetProvenance key={i} metadata={dataset} Loading={loading} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ProvenanceTab;
