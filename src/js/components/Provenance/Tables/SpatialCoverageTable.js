import React from 'react';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '../../../constants/configConstants';

const SpatialCoverageTable = ({ spatialCoverage }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

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

export default SpatialCoverageTable;
