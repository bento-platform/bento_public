import { Modal } from 'antd';
import type { Dataset } from '@/types/dataset';
import DatasetProvenance from './DatasetProvenance';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

type DatasetProvenanceModalProps = {
  dataset: Dataset | null | undefined;
  open: boolean;
  onCancel: () => void;
};

const DatasetProvenanceModal = ({ dataset, open, onCancel }: DatasetProvenanceModalProps) => {
  // if (!open) return null;
  const isSmallScreen = useSmallScreen();

  const margin = isSmallScreen ? 16 : 40;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width="min(1120px, 100%)"
      style={{ top: margin }}
      styles={{ content: { overflow: 'hidden', padding: 0 } }}
      footer={null}
      afterOpenChange={(isOpen) => {
        // Leaflet maps inside the modal init while the modal is still animating in and cache
        // a stale (often zero) container size. They listen for window resize, so trigger one
        // once the open transition finishes and the modal has its final layout size.
        if (isOpen) window.dispatchEvent(new Event('resize'));
      }}
    >
      {/* max height: 100vh - 2 * top margin - (minimal antd modal margin == 16px) */}
      <DatasetProvenance dataset={dataset} style={{ maxHeight: `calc(100vh - 2 * ${margin}px - 16px)` }} />
    </Modal>
  );
};

export default DatasetProvenanceModal;
