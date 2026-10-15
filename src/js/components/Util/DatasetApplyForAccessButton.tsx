import { Button, type ButtonProps } from 'antd';
import { AuditOutlined, ExportOutlined } from '@ant-design/icons';
import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { useTranslationFn } from '@/hooks';

const DatasetApplyForAccessButton = (props: Omit<ButtonProps, 'icon' | 'onClick'>) => {
  const isAuthenticated = useIsAuthenticated();
  const t = useTranslationFn();
  return (
    <Button
      icon={<AuditOutlined />}
      className="flex-1"
      onClick={() => {
        let accessUrl = APPLY_FOR_ACCESS_URL;
        // If we're in PCGL mode, already have a PCGL account, and are signed in, force the auth flow to occur
        // at the DACO side.
        if (PCGL_MODE && isAuthenticated) {
          // TODO: more systematic, less hard-coded version to force SSO & preserve state?
          accessUrl += '/api/auth/login';
        }
        window.open(accessUrl, '_blank');
      }}
      {...props}
    >
      {t('dataset.apply_for_access')} <ExportOutlined />
    </Button>
  );
};

export default DatasetApplyForAccessButton;
