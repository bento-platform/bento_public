import React from 'react';
import PropTypes from 'prop-types';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProvenanceStoreDataset } from '@/types/provenance';

const DATS_FILENAME = 'DATS.json';

const DownloadDats = ({ metadata }: { metadata: ProvenanceStoreDataset }) => {
    const { t } = useTranslation();

    const downloadData = () => {
        const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = DATS_FILENAME;
        link.click();

        URL.revokeObjectURL(url);
    };

    const isDatsFileEmpty = metadata && metadata.dats_file ? Object.keys(metadata.dats_file).length === 0 : true;

    return (
        <Space style={{ marginTop: '20px', justifyContent: 'center' }}>
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={downloadData}
                disabled={isDatsFileEmpty}
            >
                {t("Download DATS File")}
            </Button>
        </Space>
    );
};

DownloadDats.propTypes = {
    metadata: PropTypes.object.isRequired,
};

export default DownloadDats;
