import { Modal, type ModalProps } from 'antd';
import { T_SINGULAR_COUNT } from '@/constants/i18n';
import { useTranslationFn } from '@/hooks';
import type { DatasetV2 } from '@/types/datasetV2';
import { DatasetV2ProvenanceContent } from './DatasetV2Provenance';

type DatasetProvenanceModalProps = { dataset: DatasetV2 | null | undefined } & Omit<
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
      {dataset && <DatasetV2ProvenanceContent dataset={dataset} />}
    </Modal>
  );
};

export default DatasetProvenanceModal;
