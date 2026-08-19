import type { CSSProperties } from 'react';
import { Card } from 'antd';
import type { Dataset } from '@/types/dataset';
import DatasetProvenance from './DatasetProvenance';

// ---- Card wrapper (used on dedicated provenance page) ----

export type DatasetProvenanceProps = {
  dataset: Dataset;
  loading?: boolean;
  hideHeader?: boolean;
};

const MIN_HEIGHT_CSS: CSSProperties = {
  minHeight: 'calc(100vh - 210px - var(--scoped-title-height) - var(--header-height) - 2 * var(--content-padding-v))',
};

const DatasetProvenanceCard = ({ dataset, loading, hideHeader }: DatasetProvenanceProps) => (
  <Card
    className="container mx-auto shadow rounded-xl overflow-hidden"
    loading={loading}
    style={MIN_HEIGHT_CSS}
    styles={{ body: { padding: 0 } }}
  >
    <DatasetProvenance dataset={dataset} hideHeader={hideHeader} mode="page" style={MIN_HEIGHT_CSS} />
  </Card>
);

export default DatasetProvenanceCard;
