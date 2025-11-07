import { useMemo } from 'react';

import { Popover, Space, Typography } from 'antd';

import type { BentoCountEntityCounts } from '@/types/entities';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { useTranslationFn } from '@/hooks';

const { Text } = Typography;

interface CountsDisplayProps {
  counts?: BentoCountEntityCounts;
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
        <Popover
          key={entity}
          title={label}
          content={<div style={{ maxWidth: 360 }}>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</div>}
        >
          <Space size={4} align="center" style={{ cursor: 'pointer' }}>
            {icon}
            <Text style={{ fontSize }}>{value.toLocaleString()}</Text>
          </Space>
        </Popover>
      ))}
    </Space>
  );
};

export default CountsDisplay;
