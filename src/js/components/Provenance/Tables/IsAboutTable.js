import React from 'react';
import { Table, Tag } from 'antd';
import LinkIfUrl from '../../Util/LinkIfUrl';

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
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
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
