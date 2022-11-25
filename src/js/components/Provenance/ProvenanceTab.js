import React from 'react';
import { Row } from 'antd';
import { useSelector } from 'react-redux';
import DatasetProvenance from './DatasetProvenance';

const ProvenanceTab = () => {
  const { data, isFetching: loading } = useSelector((state) => state.provenance);

  return (
    <Row justify="center">
      {data.map((dataset, i) => (
        <DatasetProvenance key={i} metadata={dataset} Loading={loading} />
      ))}
    </Row>
  );
};

export default ProvenanceTab;
