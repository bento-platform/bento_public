import { Tag } from 'antd';

import { useTranslationFn } from '@/hooks';
import type { DatsFile } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const CreatedByTable = ({ creators }: CreatedByTableProps) => {
  const t = useTranslationFn();

  return (
    <BaseProvenanceTable
      dataSource={creators}
      columns={[
        {
          title: t('Name'),
          dataIndex: 'name',
          key: 'name',
          render: (text) => t(text),
        },
        {
          title: t('Abbreviation'),
          dataIndex: 'abbreviation',
          key: 'abbreviation',
          render: (text) => t(text),
        },
        {
          title: t('Roles'),
          dataIndex: 'roles',
          key: 'roles',
          render: (_, { roles }) =>
            roles &&
            roles.map((r, i) => (
              <Tag key={i} color="cyan">
                {t(r.value.toString())}
              </Tag>
            )),
        },
      ]}
      rowKey="name"
    />
  );
};

export interface CreatedByTableProps {
  creators: DatsFile['creators'];
}

export default CreatedByTable;
