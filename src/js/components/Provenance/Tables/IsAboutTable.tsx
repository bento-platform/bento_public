import React from 'react';
import { Table, Tag } from 'antd';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const IsAboutTable = ({ isAbout }: IsAboutTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={isAbout}
      columns={[
        { title: td('Name'), dataIndex: 'name', render: (text) => t(text) },
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
      bordered={true}
      pagination={false}
      size="small"
    />
  );
};

export interface IsAboutTableProps {
  isAbout: ProvenanceStoreDataset['isAbout'];
}

export default IsAboutTable;
