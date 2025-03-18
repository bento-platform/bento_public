import { Typography, Space } from 'antd';

import { WIDTH_100P_STYLE } from '@/constants/common';
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
    <Space direction="vertical" size={0} style={WIDTH_100P_STYLE}>
      <Typography.Title level={3}>{t(title)}</Typography.Title>
      <OverviewDisplayData section={title} allCharts={chartData} searchableFields={searchableFields} />
    </Space>
  );
};

export default OverviewSection;
