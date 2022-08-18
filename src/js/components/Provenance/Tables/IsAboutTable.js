import React from 'react';
import { Table, Tag, Typography } from 'antd';
const { Link } = Typography;

const IsAboutTable = ({ isAbout }) => {
  return (
    <Table
      dataSource={isAbout}
      columns={[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Identifier',
          dataIndex: 'identifier.identifier',
          key: 'identifier.identifier',
          render: (_, { identifier }) => <Link href={identifier.identifier}>{identifier.identifier}</Link>,
        },
        {
          title: 'Identifier Source',
          dataIndex: 'identifier.identifierSource',
          key: 'identifier.identifierSource',
          render: (_, { identifier }) => <Tag color="cyan">{identifier.identifierSource}</Tag>,
        },
      ]}
      pagination={false}
      size="small"
    />
  );
};

export default IsAboutTable;
