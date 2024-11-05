import { Fragment } from 'react';

import LinkIfUrl from '@/components/Util/LinkIfUrl';
import type { Acknowledge } from '@/types/dats';
import { useTranslationFn } from '@/hooks';

import BaseProvenanceTable from './BaseProvenanceTable';

const AcknowledgesTable = ({ acknowledges }: AcknowledgesTableProps) => {
  const t = useTranslationFn();

  return (
    <BaseProvenanceTable
      dataSource={acknowledges}
      columns={[
        {
          title: t('Name'),
          dataIndex: 'name',
          render: (text) => t(text),
        },
        {
          title: t('Funders'),
          dataIndex: 'funders',
          render: (_, { funders }) =>
            funders.map((f, i) => (
              <Fragment key={i}>
                <LinkIfUrl text={f.name} />
                {f.abbreviation ? ` (${t(f.abbreviation)})` : ''}
                {i < funders.length - 1 ? '; ' : ''}
              </Fragment>
            )),
        },
      ]}
      rowKey="name"
    />
  );
};

export interface AcknowledgesTableProps {
  acknowledges: Acknowledge[];
}

export default AcknowledgesTable;
