import { useState } from 'react';
import { Button, type ButtonProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslationFn } from '@/hooks';
import { useExportFileManifest } from '@/hooks/useExportFileManifest';

const DatasetGetManifestButton = (props: Omit<ButtonProps, 'className' | 'icon' | 'onClick'>) => {
  const t = useTranslationFn();
  const [exporting, setExporting] = useState(false);
  const onExportManifest = useExportFileManifest(false, [], setExporting);
  return (
    <Button
      icon={<DownloadOutlined />}
      className="flex-1"
      loading={exporting || props.loading}
      onClick={onExportManifest}
      {...props}
    >
      {t('dataset.get_manifest')}
    </Button>
  );
};

export default DatasetGetManifestButton;
