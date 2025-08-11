import { useCallback } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { datasetsUrl } from '@/constants/configConstants';
import { useTranslationFn } from '@/hooks';
import type { Dataset } from '@/types/metadata';

const DownloadDats = ({ dataset }: { dataset: Dataset }) => {
  const t = useTranslationFn();

  const exportData = useCallback(() => {
    window.location.href = `${datasetsUrl}/${dataset.identifier}/dats?format=json&attachment=true`;
  }, [dataset]);

  const isDatsFileEmpty = Object.keys(dataset?.dats_file ?? {}).length === 0;

  return (
    <Space style={{ marginTop: '20px', justifyContent: 'center' }}>
      <Button type="primary" icon={<DownloadOutlined />} onClick={exportData} disabled={isDatsFileEmpty}>
        {t('Download DATS File')}
      </Button>
    </Space>
  );
};

export default DownloadDats;
