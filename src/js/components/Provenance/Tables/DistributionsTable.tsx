import { useMemo } from 'react';

import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
const { Link } = Typography;

import BaseProvenanceTable from './BaseProvenanceTable';
import { useTranslationDefault, useTranslationCustom } from '@/hooks';
import type { Distribution, ProvenanceStoreDataset } from '@/types/provenance';

const DistributionsTable = ({ distributions }: DistributionsTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const columns = useMemo(
    () =>
      [
        {
          title: td('Formats'),
          dataIndex: 'formats',
          render: (_, { formats = [] }) =>
            formats.map((f) => (
              <Tag color="cyan" key={f}>
                {f}
              </Tag>
            )),
        },
        {
          title: td('Size'),
          dataIndex: 'size',
          render: (text = '') => t(text),
        },
        {
          title: td('Unit'),
          dataIndex: 'unit',
          render: (_, { unit = { value: '' } }) => t(unit.value.toString()),
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
                access.authorizations?.map((a, i) => (
                  <Tag key={i} color="cyan">
                    {t(a.value.toString())}
                  </Tag>
                )),
            },
          ],
        },
      ] as ColumnsType<Distribution>,
    [t, td]
  );

  return (
    <BaseProvenanceTable dataSource={distributions} columns={columns} rowKey={(record) => record.access.landingPage} />
  );
};

export interface DistributionsTableProps {
  distributions: ProvenanceStoreDataset['distributions'];
}
export default DistributionsTable;
