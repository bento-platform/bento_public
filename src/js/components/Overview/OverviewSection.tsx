import { Typography, Space } from 'antd';

import OverviewDisplayData from './OverviewDisplayData';
import { useTranslationCustom } from '@/hooks';
import type { ChartDataField } from '@/types/data';

const OverviewSection = ({ title, chartData }: { title: string; chartData: ChartDataField[] }) => {
  const t = useTranslationCustom();

  return (
    <Space direction="vertical" size={0} style={{ width: '100%' }}>
      <Typography.Title level={3}>{t(title)}</Typography.Title>
      <OverviewDisplayData section={title} allCharts={chartData} />
    </Space>
  );
};

export default OverviewSection;
