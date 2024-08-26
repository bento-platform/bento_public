import React, { Fragment, useMemo } from 'react';

import { ColumnsType } from 'antd/es/table';

import BaseProvenanceTable from '@/components/Provenance/Tables/BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import { ExtraProperty, ProvenanceStoreDataset } from '@/types/provenance';

const ExtraPropertiesTable = ({ extraProperties }: ExtraPropertiesTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const columns = useMemo(
    () =>
      [
        { title: td('Category'), dataIndex: 'category', render: (text) => t(text) },
        {
          title: td('Values'),
          dataIndex: 'values',
          render: (_, { values }) =>
            values.map((v, i) => (
              <Fragment key={i}>
                <LinkIfUrl text={v.value.toString()} />
                {i < values.length - 1 ? '; ' : ''}
              </Fragment>
            )),
        },
      ] as ColumnsType<ExtraProperty>,
    [t, td]
  );

  return <BaseProvenanceTable dataSource={extraProperties} columns={columns} rowKey="category" />;
};

export interface ExtraPropertiesTableProps {
  extraProperties: ProvenanceStoreDataset['extraProperties'];
}

export default ExtraPropertiesTable;
