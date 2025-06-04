import { DatasetProvenanceContent } from './DatasetProvenance';
import { Modal, type ModalProps } from 'antd';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/metadata';

type DatasetProvenanceModalProps = { dataset: Dataset | null | undefined } & Omit<
  ModalProps,
  'footer' | 'title' | 'width'
>;

const DatasetProvenanceModal = ({ dataset, ...props }: DatasetProvenanceModalProps) => {
  const t = useTranslationFn();
  return (
    <Modal
      title={dataset ? `${t('entities.dataset', T_SINGULAR_COUNT)}: ${t(dataset.title)}` : ''}
      footer={null}
      width={960}
      {...props}
    >
      {dataset && <DatasetProvenanceContent dataset={dataset} />}
    </Modal>
  );
};

export default DatasetProvenanceModal;
