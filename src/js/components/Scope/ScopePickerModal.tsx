import React from 'react';
import { Modal } from 'antd';
import { useTranslationDefault } from '@/hooks';
import ProjectScopePicker from './ProjectScopePicker';

interface ScopePickerModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}
export const ScopePickerModal = ({ isModalOpen, setIsModalOpen }: ScopePickerModalProps) => {
  const td = useTranslationDefault();
  const closeModal = () => setIsModalOpen(false);
  return (
    <Modal title={td('Select Scope')} open={isModalOpen} onCancel={closeModal} footer={null} width={700}>
      <ProjectScopePicker />
    </Modal>
  );
};