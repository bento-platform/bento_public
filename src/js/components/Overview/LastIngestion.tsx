import React from 'react';
import { Typography, Card, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';

const formatDataType = (dataType: string) => {
  return dataType ? dataType.charAt(0).toUpperCase() + dataType.slice(1) + 's' : 'Unknown Data Type';
};

const LastIngestionInfo: React.FC = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const lastEndTimesByDataType = useAppSelector((state) => state.ingestionData?.lastEndTimesByDataType) || {};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? date.toLocaleString(i18n.language, {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : 'Invalid Date';
  };

  return (
    <>
      <Typography.Title level={3}>{t('Latest Data Ingestion')}</Typography.Title>
      <Space direction="horizontal">
        {Object.entries(lastEndTimesByDataType).map(([dataType, endTime]) => (
          <Card key={dataType}>
            <Space direction="vertical">
              <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>{t(formatDataType(dataType))}</Typography.Text>
              <Typography.Text>
                <CalendarOutlined /> {formatDate(endTime)}
              </Typography.Text>
            </Space>
          </Card>
        ))}
      </Space>
    </>
  );
};

export default LastIngestionInfo;
