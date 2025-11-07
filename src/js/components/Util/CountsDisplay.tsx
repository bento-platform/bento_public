import { useMemo } from 'react';

import { Space, Tooltip, Typography } from 'antd';

import type { DataCounts } from '@/types/entities';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
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
    const items = COUNT_ENTITY_ORDER.map((entity) => ({
      entity,
      label: t(`entities.${entity}_other`),
      value: counts[entity],
      icon: COUNT_ENTITY_REGISTRY[entity].icon,
    })).filter((item) => typeof item.value === 'number' && item.value > 0);
    return items.length > 0 ? items : null;
  }, [counts, t]);

  if (!countsDisplay) return null;

  return (
    <Space size={[16, 8]} wrap style={{ alignItems: 'center' }}>
      {countsDisplay.map(({ entity, label, value, icon }) => (
        <Tooltip key={entity} title={label}>
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
