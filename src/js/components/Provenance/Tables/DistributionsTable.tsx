import { useMemo } from 'react';

import { Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Link } = Typography;

import { useTranslationFn } from '@/hooks';
import type { DatsFile, Distribution } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const DistributionsTable = ({ distributions }: DistributionsTableProps) => {
  const t = useTranslationFn();

  const columns = useMemo(
    () =>
      [
        {
          title: t('Formats'),
          dataIndex: 'formats',
          render: (_, { formats = [] }) =>
            formats.map((f) => (
              <Tag color="cyan" key={f}>
                {f}
              </Tag>
            )),
        },
        {
          title: t('Size'),
          dataIndex: 'size',
          render: (text = '') => t(text),
        },
        {
          title: t('Unit'),
          dataIndex: 'unit',
          render: (_, { unit = { value: '' } }) => t(unit.value.toString()),
        },
        {
          title: t('Access'),
          children: [
            {
              title: t('Landing Page'),
              dataIndex: 'access.landingPage',
              render: (_, { access }) => (
                <Link href={access.landingPage} target="_blank">
                  {access.landingPage}
                </Link>
              ),
            },
            {
              title: t('Authorizations'),
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
    [t]
  );

  return (
    <BaseProvenanceTable dataSource={distributions} columns={columns} rowKey={(record) => record.access.landingPage} />
  );
};

export interface DistributionsTableProps {
  distributions: DatsFile['distributions'];
}

export default DistributionsTable;
