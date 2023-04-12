import React from 'react';
import { Table } from 'antd';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const SpatialCoverageTable = ({ spatialCoverage }: SpatialCoverageTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={spatialCoverage}
      columns={[
        { title: td('Name'), dataIndex: 'name', key: 'name', render: (text) => t(text) },
        { title: td('Description'), dataIndex: 'description', key: 'description', render: (text) => t(text) },
      ]}
      pagination={false}
    />
  );
};

export interface SpatialCoverageTableProps {
  spatialCoverage: ProvenanceStoreDataset['spatialCoverage'];
}

export default SpatialCoverageTable;
