import React from 'react';
import { Table, Tag } from 'antd';

const CreatedByTable = ({ creators }) => {
  return (
    <Table
      dataSource={creators}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Abbreviation',
          dataIndex: 'abbreviation',
          key: 'abbreviation',
        },
        {
          title: 'Roles',
          dataIndex: 'roles',
          key: 'roles',
          render: (_, { roles }) =>
            roles.map((r, i) => (
              <Tag key={i} color="cyan">
                {r.value}
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default CreatedByTable;
