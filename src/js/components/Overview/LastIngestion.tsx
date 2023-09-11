import React, { useCallback } from 'react';
import { Typography, Card, Space, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { getDataTypeLabel } from '@/types/dataTypes';

const LastIngestionInfo: React.FC = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const lastEndTimesByDataType = useAppSelector((state) => state.ingestionData?.lastEndTimesByDataType) || {};

  const formatDate = useCallback(
    (dateString: string) => {
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
    },
    [i18n.language]
  );

  const hasData = Object.keys(lastEndTimesByDataType).length > 0;

  return (
    <Space direction="vertical" size={0}>
      <Typography.Title level={3}>{t('Latest Data Ingestion')}</Typography.Title>
      <Space direction="horizontal">
        {hasData ? (
          Object.entries(lastEndTimesByDataType).map(([dataType, endTime]) => (
            <Card key={dataType}>
              <Space direction="vertical">
                <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>{t(getDataTypeLabel(dataType))}</Typography.Text>
                <Typography.Text>
                  <CalendarOutlined /> {formatDate(endTime)}
                </Typography.Text>
              </Space>
            </Card>
          ))
        ) : (
          <Empty description={t('Ingestion History Is Empty')} />
        )}
      </Space>
    </Space>
  );
};

export default LastIngestionInfo;
