import React from 'react';
import { Table, Tag } from 'antd';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { Acknowledge } from '@/types/provenance';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';

const AcknowledgesTable = ({ acknowledges }: AcknowledgesTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={acknowledges}
      columns={[
        {
          title: td('Name'),
          dataIndex: 'name',
          key: 'name',
          render: (text) => t(text),
        },
        {
          title: td('Funders'),
          dataIndex: 'funders',
          key: 'funders',
          render: (_, { funders }) =>
            funders.map((f, i) => (
              <Tag key={i} color="cyan">
                <LinkIfUrl text={f.name} />
                {f.abbreviation ? `(${t(f.abbreviation)})` : ''}
              </Tag>
            )),
        },
      ]}
      pagination={false}
    />
  );
};

export interface AcknowledgesTableProps {
  acknowledges: Acknowledge[];
}

export default AcknowledgesTable;
