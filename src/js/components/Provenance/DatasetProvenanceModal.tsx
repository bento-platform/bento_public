import { useState } from 'react';
import { Modal, type ModalProps } from 'antd';
import type { Dataset } from '@/types/dataset';
import { DatasetProvenanceContent } from './DatasetProvenance';

type DatasetProvenanceModalProps = { dataset: Dataset | null | undefined } & Omit<
  ModalProps,
  'footer' | 'title' | 'width'
>;

const DatasetProvenanceModal = ({ dataset, ...props }: DatasetProvenanceModalProps) => {
  const [fullyOpen, setFullyOpen] = useState(false);
  return (
    <Modal footer={null} width={960} afterOpenChange={(open) => setFullyOpen(open)} {...props}>
      {/* fullyOpen required: pointchart needs container dimensions, only available after modal animation completes */}
      {dataset && fullyOpen && <DatasetProvenanceContent dataset={dataset} />}
    </Modal>
  );
};

export default DatasetProvenanceModal;
