import React from 'react';
import { Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import OverviewDisplayData from './OverviewDisplayData';
import { NON_DEFAULT_TRANSLATION } from '../../constants/configConstants';

const OverviewSection = ({ title, chartData }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  return (
    <Space direction="vertical" size={0}>
      <Typography.Title level={3}>{t(title)}</Typography.Title>
      <OverviewDisplayData section={title} allCharts={chartData} />
    </Space>
  );
};

export default OverviewSection;
