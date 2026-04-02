import type { DatasetV2 } from '@/types/datasetV2';
import DatasetV2Provenance, { DatasetV2ProvenanceContent, type DatasetV2ProvenanceProps } from './DatasetV2Provenance';

export { DatasetV2ProvenanceContent as DatasetProvenanceContent };

export type DatasetProvenanceProps = DatasetV2ProvenanceProps & { dataset: DatasetV2 };

export default DatasetV2Provenance;
