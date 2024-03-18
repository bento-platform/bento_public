import React from 'react';
import { Tag } from 'antd';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const IsAboutTable = ({ isAbout }: IsAboutTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <BaseProvenanceTable
      dataSource={isAbout}
      columns={[
        {
          title: td('Name'),
          dataIndex: 'name',
          render: (text, { identifier }) => {
            return (identifier.identifierSource ?? '').toLocaleLowerCase().includes('taxonomy') ? (
              <em>{t(text)}</em>
            ) : (
              t(text)
            );
          },
        },
        {
          title: td('Identifier'),
          dataIndex: 'identifier.identifier',
          render: (_, { identifier }) => <LinkIfUrl text={identifier.identifier} />,
        },
        {
          title: td('Identifier Source'),
          dataIndex: 'identifier.identifierSource',
          render: (_, { identifier }) => <Tag color="cyan">{t(identifier.identifierSource)}</Tag>,
        },
      ]}
      rowKey="name"
    />
  );
};

export interface IsAboutTableProps {
  isAbout: ProvenanceStoreDataset['isAbout'];
}

export default IsAboutTable;
