import { useMemo } from 'react';

import { Space, Tooltip, Typography } from 'antd';
import { ExperimentOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { BiDna } from 'react-icons/bi';

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
      { key: 'individual', label: t('entities.individual_other'), value: counts.individual, icon: <UserOutlined /> },
      { key: 'biosample', label: t('entities.biosample_other'), value: counts.biosample, icon: <BiDna /> },
      {
        key: 'experiment',
        label: t('entities.experiment_other'),
        value: counts.experiment,
        icon: <ExperimentOutlined />,
      },
      {
        key: 'experiment_result',
        label: t('entities.experiment_result_other'),
        value: counts.experiment_result,
        icon: <FileTextOutlined />,
      },
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
            <Text style={{ fontSize }}>{value.toLocaleString()}</Text>
          </Space>
        </Tooltip>
      ))}
    </Space>
  );
};

export default CountsDisplay;
