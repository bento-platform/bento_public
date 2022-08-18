import React from 'react';
import { Table } from 'antd';

const SpatialCoverageTable = ({ spatialCoverage }) => {
  return (
    <Table
      dataSource={spatialCoverage}
      columns={[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
      ]}
      pagination={false}
    />
  );
};

export default SpatialCoverageTable;
