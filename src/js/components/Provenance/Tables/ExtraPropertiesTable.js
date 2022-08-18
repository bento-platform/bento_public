import React from 'react';
import { Table, Tag } from 'antd';

const ExtraPropertiesTable = ({ extraProperties }) => {
  return (
    <Table
      dataSource={extraProperties}
      columns={[
        { title: 'Category', dataIndex: 'category', key: 'category' },
        {
          title: 'Values',
          dataIndex: 'values',
          key: 'values',
          render: (_, { values }) => values.map((v) => <Tag color="cyan">{v.value}</Tag>),
        },
      ]}
      pagination={false}
    />
  );
};

export default ExtraPropertiesTable;
