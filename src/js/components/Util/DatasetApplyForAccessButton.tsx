import { Button, type ButtonProps } from 'antd';
import { AuditOutlined, ExportOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { useApplyForAccessUrl } from '@/hooks/useApplyForAccessUrl';

const DatasetApplyForAccessButton = (props: Omit<ButtonProps, 'className' | 'icon' | 'onClick'>) => {
  const applyForAccessUrl = useApplyForAccessUrl();
  const t = useTranslationFn();
  return (
    <Button
      icon={<AuditOutlined />}
      className="flex-1"
      onClick={applyForAccessUrl ? () => window.open(applyForAccessUrl, '_blank') : undefined}
      {...props}
    >
      {t('dataset.apply_for_access')} <ExportOutlined />
    </Button>
  );
};

export default DatasetApplyForAccessButton;
