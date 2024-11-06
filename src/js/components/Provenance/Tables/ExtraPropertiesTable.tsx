import { Fragment, useMemo } from 'react';

import type { ColumnsType } from 'antd/es/table';

import LinkIfUrl from '@/components/Util/LinkIfUrl';
import { useTranslationFn } from '@/hooks';
import type { DatsFile, ExtraProperty } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const ExtraPropertiesTable = ({ extraProperties }: ExtraPropertiesTableProps) => {
  const t = useTranslationFn();

  const columns = useMemo(
    () =>
      [
        { title: t('Category'), dataIndex: 'category', render: (text) => t(text) },
        {
          title: t('Values'),
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
    [t]
  );

  return <BaseProvenanceTable dataSource={extraProperties} columns={columns} rowKey="category" />;
};

export interface ExtraPropertiesTableProps {
  extraProperties: DatsFile['extraProperties'];
}

export default ExtraPropertiesTable;
