import React from 'react';

import BaseProvenanceTable from './BaseProvenanceTable';
import LinkIfUrl from '../../Util/LinkIfUrl';
import { Acknowledge } from '@/types/provenance';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';

const AcknowledgesTable = ({ acknowledges }: AcknowledgesTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <BaseProvenanceTable
      dataSource={acknowledges}
      columns={[
        {
          title: td('Name'),
          dataIndex: 'name',
          render: (text) => t(text),
        },
        {
          title: td('Funders'),
          dataIndex: 'funders',
          render: (_, { funders }) =>
            funders.map((f, i) => (
              <React.Fragment key={i}>
                <LinkIfUrl text={f.name} />
                {f.abbreviation ? ` (${t(f.abbreviation)})` : ''}
                {i < funders.length - 1 ? '; ' : ''}
              </React.Fragment>
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
