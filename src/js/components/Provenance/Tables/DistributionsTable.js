import React from 'react';
import { Table, Tag, Typography } from 'antd';
const { Link } = Typography;

const DistributionsTable = ({ distributions }) => {
  return (
    <Table
      dataSource={distributions}
      columns={[
        {
          title: 'Formats',
          dataIndex: 'formats',
          key: 'formats',
          render: (_, { formats }) => (
            <Tag key={formats} color="cyan">
              {formats}
            </Tag>
          ),
        },
        {
          title: 'Size',
          dataIndex: 'size',
          key: 'size',
        },
        {
          title: 'Unit',
          dataIndex: 'unit',
          key: 'unit',
          render: (_, { unit }) => unit.value,
        },
        {
          title: 'Access',
          children: [
            {
              title: 'Landing Page',
              dataIndex: 'access.landingPage',
              key: 'access.landingPage',
              render: (_, { access }) => (
                <Link href={access.landingPage} target="_blank">
                  {access.landingPage}
                </Link>
              ),
            },
            {
              title: 'Authorizations',
              dataIndex: 'access.authorizations',
              key: 'access.authorizations',
              render: (_, { access }) =>
                access.authorizations.map((a, i) => (
                  <Tag key={i} color="cyan">
                    {a.value}
                  </Tag>
                )),
            },
          ],
        },
      ]}
      pagination={false}
      bordered
    />
  );
};

export default DistributionsTable;
