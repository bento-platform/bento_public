import { useCallback } from 'react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { PORTAL_URL } from '@/config';
import { useTranslationDefault } from '@/hooks';
import type { ProvenanceStoreDataset } from '@/types/provenance';

const DownloadDats = ({ metadata }: { metadata: ProvenanceStoreDataset }) => {
  const t = useTranslationDefault();

  const exportData = useCallback(() => {
    window.location.href = `${PORTAL_URL}/api/metadata/api/datasets/${metadata.identifier}/dats?format=json&attachment=true`;
  }, [metadata]);

  const isDatsFileEmpty = Object.keys(metadata?.dats_file ?? {}).length === 0;

  return (
    <Space style={{ marginTop: '20px', justifyContent: 'center' }}>
      <Button type="primary" icon={<DownloadOutlined />} onClick={exportData} disabled={isDatsFileEmpty}>
        {t('Download DATS File')}
      </Button>
    </Space>
  );
};

export default DownloadDats;
