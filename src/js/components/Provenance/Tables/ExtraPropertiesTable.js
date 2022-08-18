import React from 'react';
import { Table, Tag } from 'antd';
import LinkIfUrl from '../../Util/LinkIfUrl';

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
          render: (_, { values }) =>
            values.map((v) => (
              <Tag color="cyan">
                <LinkIfUrl text={v.value} />
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default ExtraPropertiesTable;
