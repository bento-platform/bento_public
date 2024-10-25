import { Modal } from 'antd';
import { useTranslationFn } from '@/hooks';
import ProjectScopePicker from './ProjectScopePicker';

interface ScopePickerModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}
const ScopePickerModal = ({ isModalOpen, setIsModalOpen }: ScopePickerModalProps) => {
  const t = useTranslationFn();
  const closeModal = () => setIsModalOpen(false);
  return (
    <Modal title={t('Select Scope')} open={isModalOpen} onCancel={closeModal} footer={null} width={700}>
      <ProjectScopePicker />
    </Modal>
  );
};

export default ScopePickerModal;
