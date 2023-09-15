import React from 'react';
import { Tag } from 'antd';

import BaseProvenanceTable from './BaseProvenanceTable';
import { ProvenanceStoreDataset } from '@/types/provenance';
import { useTranslationDefault, useTranslationCustom } from '@/hooks';

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
                {t(r.value)}
              </Tag>
            )),
        },
      ]}
    />
  );
};

export interface CreatedByTableProps {
  creators: ProvenanceStoreDataset['creators'];
}

export default CreatedByTable;
