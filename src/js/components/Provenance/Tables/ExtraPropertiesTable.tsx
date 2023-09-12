import React from 'react';
import { Table, Tag } from 'antd';

import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ProvenanceStoreDataset } from '@/types/provenance';

const ExtraPropertiesTable = ({ extraProperties }: ExtraPropertiesTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <Table
      dataSource={extraProperties}
      columns={[
        { title: td('Category'), dataIndex: 'category', render: (text) => t(text) },
        {
          title: td('Values'),
          dataIndex: 'values',
          render: (_, { values }) =>
            values.map((v, i) => (
              <Tag key={i} color="cyan">
                <LinkIfUrl text={v.value} />
              </Tag>
            )),
        },
      ]}
      bordered={true}
      pagination={false}
      size="small"
    />
  );
};

export interface ExtraPropertiesTableProps {
  extraProperties: ProvenanceStoreDataset['extraProperties'];
}

export default ExtraPropertiesTable;
