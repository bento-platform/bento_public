import { useMemo } from 'react';

import { Popover, Space, Typography } from 'antd';

import type { BentoCountEntityCountsOrBoolean } from '@/types/entities';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { useTranslationFn } from '@/hooks';
import { useRenderCount } from '@/utils/counts';
import { NO_RESULTS_DASHES } from '@/features/search/constants';

const { Text } = Typography;

interface CountsDisplayProps {
  counts?: BentoCountEntityCountsOrBoolean;
  fontSize?: string;
}

const CountsDisplay = ({ counts, fontSize = '1rem' }: CountsDisplayProps) => {
  const t = useTranslationFn();
  const renderCount = useRenderCount();

  const countsDisplay = useMemo(() => {
    if (!counts) return null;
    const items = COUNT_ENTITY_ORDER.map((entity) => {
      const renderedValue = renderCount(counts[entity]);
      return {
        entity,
        label: t(`entities.${entity}_other`),
        value: renderedValue,
        icon: COUNT_ENTITY_REGISTRY[entity].icon,
      };
    }).filter((item) => item.value !== NO_RESULTS_DASHES && item.value !== 0);
    return items.length > 0 ? items : null;
  }, [counts, t, renderCount]);

  if (!countsDisplay) return null;

  return (
    <Space size={[16, 8]} wrap align="center">
      {countsDisplay.map(({ entity, label, value, icon }) => (
        <Popover
          key={entity}
          title={label}
          content={<div style={{ maxWidth: 360 }}>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</div>}
        >
          <Space size={4} align="center" className="cursor-pointer">
            {icon}
            <Text style={{ fontSize }}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
          </Space>
        </Popover>
      ))}
    </Space>
  );
};

export default CountsDisplay;
