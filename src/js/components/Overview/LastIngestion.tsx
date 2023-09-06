import React, { useCallback } from 'react';
import { Typography, Card, Space, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import ConditionalWrapper from '../Util/ConditionalWrapper';

const formatDataType = (dataType: string) => {
  return dataType ? dataType.charAt(0).toUpperCase() + dataType.slice(1) + 's' : 'Unknown Data Type';
};

const LastIngestionInfo: React.FC = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const lastEndTimesByDataType = useAppSelector((state) => state.ingestionData?.lastEndTimesByDataType) || {};
  const sections = useAppSelector((state) => state.data?.sections ?? []);

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
  const hasSections = sections.length > 0;

  return (
    <ConditionalWrapper
      condition={hasData && hasSections}
      wrapper={children => <Space direction="vertical" size={0}>{children}</Space>}
    >
      <Typography.Title level={3}>{t('Latest Data Ingestion')}</Typography.Title>
      <Space direction="horizontal">
        {hasData ? (
          Object.entries(lastEndTimesByDataType).map(([dataType, endTime]) => (
            <Card key={dataType}>
              <Space direction="vertical">
                <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>{t(formatDataType(dataType))}</Typography.Text>
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
    </ConditionalWrapper>
  );
};

export default LastIngestionInfo;
