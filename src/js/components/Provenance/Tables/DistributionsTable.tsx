import React from 'react';
import { Table, Tag, Typography } from 'antd';
const { Link } = Typography;
import { useTranslationDefault, useTranslationCustom } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const DistributionsTable = ({ distributions }: DistributionsTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={distributions}
      columns={[
        {
          title: td('Formats'),
          dataIndex: 'formats',
          render: (_, { formats }) => <Tag color="cyan">{formats}</Tag>,
        },
        {
          title: td('Size'),
          dataIndex: 'size',
          render: (text) => t(text),
        },
        {
          title: td('Unit'),
          dataIndex: 'unit',
          render: (_, { unit }) => t(unit.value),
        },
        {
          title: td('Access'),
          children: [
            {
              title: td('Landing Page'),
              dataIndex: 'access.landingPage',
              render: (_, { access }) => (
                <Link href={access.landingPage} target="_blank">
                  {access.landingPage}
                </Link>
              ),
            },
            {
              title: td('Authorizations'),
              dataIndex: 'access.authorizations',
              render: (_, { access }) =>
                access.authorizations.map((a, i) => (
                  <Tag key={i} color="cyan">
                    {t(a.value)}
                  </Tag>
                )),
            },
          ],
        },
      ]}
      bordered={true}
      pagination={false}
      size="small"
    />
  );
};

export interface DistributionsTableProps {
  distributions: ProvenanceStoreDataset['distributions'];
}
export default DistributionsTable;
