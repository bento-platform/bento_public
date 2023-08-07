import React from 'react';
import PropTypes from 'prop-types';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProvenanceStoreDataset } from '@/types/provenance';

const DownloadDats = ({ metadata }: { metadata: ProvenanceStoreDataset }) => {
  const { t } = useTranslation();

  const exportData = () => {
    const id = metadata.identifier;
    window.location.href = `/datasets/${id}/dats`;
  };

  const isDatsFileEmpty = metadata && metadata.dats_file ? Object.keys(metadata.dats_file).length === 0 : true;

  return (
    <Space style={{ marginTop: '20px', justifyContent: 'center' }}>
      <Button type="primary" icon={<DownloadOutlined />} onClick={exportData} disabled={isDatsFileEmpty}>
        {t('Download DATS File')}
      </Button>
    </Space>
  );
};

DownloadDats.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default DownloadDats;
