import React from 'react';
import { Row, Typography } from 'antd';
import DatasetProvenance from './DatasetProvenance';
import { useAppSelector, useTranslationDefault } from '@/hooks';

const ProvenanceTab = () => {
  const td = useTranslationDefault();
  const { data, isFetching: loading } = useAppSelector((state) => state.provenance);

  return (
    <>
      <Typography.Title level={2}>{td('Provenance')}</Typography.Title>
      <Row justify="center">
        {data.map((dataset, i) => (
          <DatasetProvenance key={i} metadata={dataset} loading={loading} />
        ))}
      </Row>
    </>
  );
};

export default ProvenanceTab;
