import { Modal, type ModalProps, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import { useGetRouteTitleAndIcon } from '@/hooks/navigation';
import { getCurrentPage } from '@/utils/router';

const { Paragraph } = Typography;

type CurrentPageHelpModalProps = Omit<ModalProps, 'title' | 'footer'>;

const CurrentPageHelpModal = (props: CurrentPageHelpModalProps) => {
  const t = useTranslationFn();
  const currentPage = getCurrentPage();
  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();
  const currentTitle = getRouteTitleAndIcon(currentPage)[0];

  const pageHelp = t(`page_help.${currentPage}`, { joinArrays: ' ' }).split('\n');

  return (
    <Modal {...props} title={`${t('Help for')} '${t(currentTitle)}'`} footer={null} width={960}>
      {pageHelp.map((para, pk) => (
        <Paragraph key={pk} className={pk === pageHelp.length - 1 ? 'mb-0' : ''}>
          {para}
        </Paragraph>
      ))}
    </Modal>
  );
};

export default CurrentPageHelpModal;
