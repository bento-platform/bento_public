import React from 'react';
import { Table, Tag, Typography } from 'antd';
const { Link } = Typography;

const AcknowledgesTable = ({ acknowledges }) => {
  return (
    <Table
      dataSource={acknowledges}
      columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Funders',
          dataIndex: 'funders',
          key: 'funders',
          render: (_, { funders }) =>
            funders.map((f) => (
              <Tag color="cyan">
                <Link href={f.name}>{f.name}</Link>
                {f.abbreviation ? `(${f.abbreviation})` : ''}
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export default AcknowledgesTable;
