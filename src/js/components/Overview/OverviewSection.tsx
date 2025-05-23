import { Typography, Space } from 'antd';

import { useTranslationFn } from '@/hooks';
import type { ChartDataField } from '@/types/data';
import OverviewDisplayData from './OverviewDisplayData';

const OverviewSection = ({
  title,
  chartData,
  searchableFields,
}: {
  title: string;
  chartData: ChartDataField[];
  searchableFields: Set<string>;
}) => {
  const t = useTranslationFn();

  return (
    <Space direction="vertical" size={0} className="w-full">
      <Typography.Title level={3}>{t(title)}</Typography.Title>
      <OverviewDisplayData section={title} allCharts={chartData} searchableFields={searchableFields} />
    </Space>
  );
};

export default OverviewSection;
