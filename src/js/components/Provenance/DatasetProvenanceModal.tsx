import { useState } from 'react';
import { Modal, type ModalProps } from 'antd';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/dataset';
import { DatasetProvenanceContent } from './DatasetProvenance';

type DatasetProvenanceModalProps = { dataset: Dataset | null | undefined } & Omit<
  ModalProps,
  'footer' | 'title' | 'width'
>;

const DatasetProvenanceModal = ({ dataset, ...props }: DatasetProvenanceModalProps) => {
  const t = useTranslationFn();
  const [fullyOpen, setFullyOpen] = useState(false);
  return (
    <Modal
      title={dataset ? `${t('entities.dataset', T_SINGULAR_COUNT)}: ${t(dataset.title)}` : ''}
      footer={null}
      width={960}
      afterOpenChange={(open) => setFullyOpen(open)}
      {...props}
    >
      {dataset && fullyOpen && <DatasetProvenanceContent dataset={dataset} />}
    </Modal>
  );
};

export default DatasetProvenanceModal;
