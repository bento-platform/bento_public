import { Button, type ButtonProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { useExportFileManifest } from '@/hooks/useExportFileManifest';

const DatasetGetManifestButton = ({ loading, ...props }: Omit<ButtonProps, 'className' | 'icon' | 'onClick'>) => {
  const t = useTranslationFn();
  const { exportFileManifest, isExportingFileManifest } = useExportFileManifest(true);
  return (
    <Button
      icon={<DownloadOutlined />}
      className="flex-1"
      loading={isExportingFileManifest || loading}
      onClick={exportFileManifest}
      {...props}
    >
      {t('dataset.get_manifest')}
    </Button>
  );
};

export default DatasetGetManifestButton;
