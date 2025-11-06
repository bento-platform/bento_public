import { useMemo } from 'react';

import { Space, Tooltip, Typography } from 'antd';
import { ExperimentOutlined, UserOutlined, DotChartOutlined } from '@ant-design/icons';

import type { DataCounts } from '@/types/metadata';
import { useTranslationFn } from '@/hooks';

const { Text } = Typography;

interface CountsDisplayProps {
  counts?: DataCounts;
  fontSize?: string;
}

const CountsDisplay = ({ counts, fontSize = '1rem' }: CountsDisplayProps) => {
  const t = useTranslationFn();

  const countsDisplay = useMemo(() => {
    if (!counts) return null;
    const items = [
      { key: 'individual', label: t('Individuals'), value: counts.individual, icon: <UserOutlined /> },
      { key: 'biosample', label: t('Biosamples'), value: counts.biosample, icon: <DotChartOutlined /> },
      { key: 'experiment', label: t('Experiments'), value: counts.experiment, icon: <ExperimentOutlined /> },
    ].filter((item) => item.value > 0);
    return items.length > 0 ? items : null;
  }, [counts, t]);

  if (!countsDisplay) return null;

  return (
    <Space size={[16, 8]} wrap style={{ alignItems: 'center' }}>
      {countsDisplay.map(({ key, label, value, icon }) => (
        <Tooltip key={key} title={label}>
          <Space size={4} align="center">
            {icon}
            <Text strong style={{ fontSize }}>
              {value.toLocaleString()}
            </Text>
          </Space>
        </Tooltip>
      ))}
    </Space>
  );
};

export default CountsDisplay;
