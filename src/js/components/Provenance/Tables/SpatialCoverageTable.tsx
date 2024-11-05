import { useTranslationFn } from '@/hooks';
import type { DatsFile } from '@/types/dats';

import BaseProvenanceTable from './BaseProvenanceTable';

const SpatialCoverageTable = ({ spatialCoverage }: SpatialCoverageTableProps) => {
  const t = useTranslationFn();

  return (
    <BaseProvenanceTable
      dataSource={spatialCoverage}
      columns={[
        { title: t('Name'), dataIndex: 'name', render: (text) => t(text) },
        { title: t('Description'), dataIndex: 'description', render: (text) => t(text) },
      ]}
      rowKey="name"
    />
  );
};

export interface SpatialCoverageTableProps {
  spatialCoverage: DatsFile['spatialCoverage'];
}

export default SpatialCoverageTable;
