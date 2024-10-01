import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { DatsFile } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const SpatialCoverageTable = ({ spatialCoverage }: SpatialCoverageTableProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  return (
    <BaseProvenanceTable
      dataSource={spatialCoverage}
      columns={[
        { title: td('Name'), dataIndex: 'name', render: (text) => t(text) },
        { title: td('Description'), dataIndex: 'description', render: (text) => t(text) },
      ]}
      rowKey="name"
    />
  );
};

export interface SpatialCoverageTableProps {
  spatialCoverage: DatsFile['spatialCoverage'];
}

export default SpatialCoverageTable;
