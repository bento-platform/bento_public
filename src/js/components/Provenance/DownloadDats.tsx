import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProvenanceStoreDataset } from '@/types/provenance';

const DATS_FILENAME = 'DATS.json';

const DownloadDats = ({ metadata }: { metadata: ProvenanceStoreDataset }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const downloadData = async () => {
    setLoading(true);
    try {
      const id = metadata.identifier;
      const response = await axios.get(`/datasets/${id}/dats`);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = DATS_FILENAME;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      message.error('Failed to download DATS file');
    } finally {
      setLoading(false);
    }
  };

  const isDatsFileEmpty = metadata && metadata.dats_file ? Object.keys(metadata.dats_file).length === 0 : true;

  return (
    <Space style={{ marginTop: '20px', justifyContent: 'center' }}>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={downloadData}
        disabled={isDatsFileEmpty}
        loading={isLoading}
      >
        {t('Download DATS File')}
      </Button>
    </Space>
  );
};

DownloadDats.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default DownloadDats;
