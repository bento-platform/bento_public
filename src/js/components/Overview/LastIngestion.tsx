import React from 'react';
import { Typography, Card, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { ingestionData } from '@/types/lastIngestionResponse';

const formatDataType = (dataType: string) => {
  return (dataType ? dataType.charAt(0).toUpperCase() + dataType.slice(1) + 's' : 'Unknown Data Type');
};

const LastIngestionInfo: React.FC = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const workflows: ingestionData[] = useAppSelector((state) => state.ingestionData?.ingestionData) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (!isNaN(date.getTime()) ? date.toLocaleString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) : 'Invalid Date');
  };

  return (
    <>
      <Typography.Title level={3}>{t('Latest Data Ingestion')}</Typography.Title>
      <Space direction="horizontal">
        {workflows.map((workflow) => (
          <Card key={workflow.run_id}>
            <Space direction="vertical">
              <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>
                {t(formatDataType(workflow.request.tags.workflow_metadata.data_type))}
              </Typography.Text>
              <Typography.Text>
                <CalendarOutlined /> {formatDate(workflow.end_time)}
              </Typography.Text>
            </Space>
          </Card>
        ))}
      </Space>
    </>
  );
};

export default LastIngestionInfo;
