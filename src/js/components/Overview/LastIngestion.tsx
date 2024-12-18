import type React from 'react';
import { useCallback } from 'react';
import { Card, Empty, Space, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '@/hooks';

import type { LastIngestionDataTypeResponse } from '@/types/lastIngestionDataTypeResponse';
import { T_PLURAL_COUNT } from '@/constants/i18n';
import { BOX_SHADOW } from '@/constants/overviewConstants';

const LastIngestionInfo: React.FC = () => {
  const { t, i18n } = useTranslation();

  const dataTypesObject = useAppSelector((state) => state.lastIngestionData?.dataTypes) || {};

  const sortedDataTypes = Object.values(dataTypesObject).sort((a, b) => a.label.localeCompare(b.label));

  // Filter out the queryable data types
  const queryableDataTypes = sortedDataTypes.filter((dataType: LastIngestionDataTypeResponse) => dataType.queryable);

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

  const hasData = queryableDataTypes.length > 0;

  return (
    <Space direction="vertical" size={0}>
      <Typography.Title level={3}>{t('Latest Data Ingestion')}</Typography.Title>
      <Space wrap>
        {hasData ? (
          queryableDataTypes.map((dataType: LastIngestionDataTypeResponse) => (
            <Card style={BOX_SHADOW} key={dataType.id}>
              <Space direction="vertical">
                <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>
                  {t(`entities.${dataType.id}`, T_PLURAL_COUNT)}
                </Typography.Text>
                <Typography.Text>
                  <CalendarOutlined />{' '}
                  {dataType.last_ingested ? formatDate(dataType.last_ingested) : t('Not Available')}
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
