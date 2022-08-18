import React from 'react';
import { Table, Tag } from 'antd';
import LinkIfUrl from '../../Util/LinkIfUrl';

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
                <LinkIfUrl text={f.name} />
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
