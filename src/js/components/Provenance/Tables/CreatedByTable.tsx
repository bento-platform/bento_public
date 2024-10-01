import { Tag } from 'antd';

import { useTranslationDefault, useTranslationCustom } from '@/hooks';
import type { DatsFile } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const CreatedByTable = ({ creators }: CreatedByTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <BaseProvenanceTable
      dataSource={creators}
      columns={[
        {
          title: td('Name'),
          dataIndex: 'name',
          key: 'name',
          render: (text) => t(text),
        },
        {
          title: td('Abbreviation'),
          dataIndex: 'abbreviation',
          key: 'abbreviation',
          render: (text) => t(text),
        },
        {
          title: td('Roles'),
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
