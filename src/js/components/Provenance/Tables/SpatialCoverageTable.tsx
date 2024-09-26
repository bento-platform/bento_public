import BaseProvenanceTable from './BaseProvenanceTable';
import { useTranslationCustom, useTranslationDefault } from '@/hooks';
import type { ProvenanceStoreDataset } from '@/types/provenance';

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
  spatialCoverage: ProvenanceStoreDataset['spatialCoverage'];
}

export default SpatialCoverageTable;
