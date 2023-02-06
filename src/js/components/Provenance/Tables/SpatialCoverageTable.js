import React from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

const SpatialCoverageTable = ({ spatialCoverage }) => {
  const { t } = useTranslation();

  return (
    <Table
      dataSource={spatialCoverage}
      columns={[
        { title: t('Name'), dataIndex: 'name', key: 'name', render: (text) => t(text) },
        { title: t('Description'), dataIndex: 'description', key: 'description', render: (text) => t(text) },
      ]}
      pagination={false}
    />
  );
};

export default SpatialCoverageTable;
