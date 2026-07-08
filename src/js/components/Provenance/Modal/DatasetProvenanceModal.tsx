import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import type { Dataset } from '@/types/dataset';
import DatasetProvenance from './DatasetProvenance';

type DatasetProvenanceModalProps = {
  dataset: Dataset | null | undefined;
  open: boolean;
  onCancel: () => void;
};

const DatasetProvenanceModal = ({ dataset, open, onCancel }: DatasetProvenanceModalProps) => {
  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const modal = (
    <div className="pm-scrim" onClick={onCancel}>
      <div className="pm-modal" role="dialog" aria-label="Dataset provenance" onClick={(e) => e.stopPropagation()}>
        <DatasetProvenance dataset={dataset} onClose={onCancel} />
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default DatasetProvenanceModal;
