import { useState } from 'react';
import { Button, type ButtonProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { useExportFileManifest } from '@/hooks/useExportFileManifest';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';

const DatasetGetManifestButton = ({
  scope,
  loading,
  ...props
}: Omit<ButtonProps, 'className' | 'icon' | 'onClick'> & { scope: DiscoveryScope }) => {
  const t = useTranslationFn();
  const [exporting, setExporting] = useState(false);
  const onExportManifest = useExportFileManifest(scope, false, [], setExporting);
  return (
    <Button
      icon={<DownloadOutlined />}
      className="flex-1"
      loading={exporting || loading}
      onClick={onExportManifest}
      {...props}
    >
      {t('dataset.get_manifest')}
    </Button>
  );
};

export default DatasetGetManifestButton;
