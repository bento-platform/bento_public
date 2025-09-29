import { useMemo } from 'react';
import { Card, Empty, Skeleton, Space, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { T_PLURAL_COUNT } from '@/constants/i18n';
import { WAITING_STATES } from '@/constants/requests';
import { useDataTypes } from '@/features/dataTypes/hooks';
import type { BentoServiceDataType } from '@/types/dataTypes';
import { useTranslationFn } from '@/hooks';

import OverviewCollapsibleSection from './Util/OverviewCollapsibleSection';

const formatDate = (dateString: string, language: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime())
    ? date.toLocaleString(language, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'Invalid Date';
};

const LastIngestionSkeleton = () => (
  <Card className="shadow">
    <Space direction="vertical">
      <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>
        <Skeleton active={true} title={{ width: 100, style: { margin: 0 } }} paragraph={false} />
      </Typography.Text>
      <Typography.Text>
        <CalendarOutlined />{' '}
        <Skeleton
          active={true}
          style={{ display: 'inline', verticalAlign: 'top' }}
          title={{ width: 82, style: { margin: '5px 0 0 0' } }}
          paragraph={false}
        />
      </Typography.Text>
    </Space>
  </Card>
);

const LastIngestionDataType = ({ dataType }: { dataType: BentoServiceDataType }) => {
  const { t, i18n } = useTranslation();
  return (
    <Card className="shadow" key={dataType.id}>
      <Space direction="vertical">
        <Typography.Text style={{ color: 'rgba(0,0,0,0.45)' }}>
          {t(`entities.${dataType.id}`, T_PLURAL_COUNT)}
        </Typography.Text>
        <Typography.Text>
          <CalendarOutlined />{' '}
          {dataType.last_ingested ? formatDate(dataType.last_ingested, i18n.language) : t('Not Available')}
        </Typography.Text>
      </Space>
    </Card>
  );
};

const LastIngestionInfo = () => {
  const t = useTranslationFn();

  const { status: dataTypesStatus, dataTypesById } = useDataTypes();

  const queryableDataTypes = useMemo(
    () =>
      Object.values(dataTypesById)
        .sort((a, b) => a.label.localeCompare(b.label))
        .filter((dataType) => dataType.queryable), // Filter to only include the queryable data types
    [dataTypesById]
  );

  const hasData = queryableDataTypes.length > 0;

  return (
    <OverviewCollapsibleSection title="Latest Data Ingestion">
      <Space wrap>
        {WAITING_STATES.includes(dataTypesStatus) ? (
          <LastIngestionSkeleton />
        ) : hasData ? (
          queryableDataTypes.map((dataType) => <LastIngestionDataType dataType={dataType} key={dataType.id} />)
        ) : (
          <Empty description={t('Ingestion History Is Empty')} />
        )}
      </Space>
    </OverviewCollapsibleSection>
  );
};

export default LastIngestionInfo;
