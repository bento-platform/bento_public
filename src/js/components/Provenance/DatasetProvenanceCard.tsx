import { Card } from 'antd';
import type { Dataset } from '@/types/dataset';
import DatasetProvenance from './Modal/DatasetProvenance';

// ---- Card wrapper (used on dedicated provenance page) ----

export type DatasetProvenanceProps = {
  dataset: Dataset;
  loading?: boolean;
  hideHeader?: boolean;
};

const DatasetProvenanceCard = ({ dataset, loading, hideHeader }: DatasetProvenanceProps) => (
  <div className="container margin-auto">
    <Card className="shadow rounded-xl overflow-hidden" loading={loading} styles={{ body: { padding: 0 } }}>
      <DatasetProvenance dataset={dataset} hideHeader={hideHeader} mode="page" />
    </Card>
  </div>
);

export default DatasetProvenanceCard;
