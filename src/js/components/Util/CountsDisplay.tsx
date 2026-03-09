import { useMemo } from 'react';

import { Popover, Space, Typography } from 'antd';

import type { BentoCountEntityCountsOrBooleans } from '@/types/entities';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { useTranslationFn } from '@/hooks';
import { useRenderCount } from '@/hooks/counts';
import { NO_RESULTS_DASHES } from '@/features/search/constants';

const { Text } = Typography;

interface CountsDisplayProps {
  counts?: BentoCountEntityCountsOrBooleans;
  totalCounts?: BentoCountEntityCountsOrBooleans;
  fontSize?: string;
}

const CountsDisplay = ({ counts, totalCounts, fontSize = '1rem' }: CountsDisplayProps) => {
  const t = useTranslationFn();
  const renderCount = useRenderCount();

  const countsDisplay = useMemo(() => {
    if (!counts) return null;
    const items = COUNT_ENTITY_ORDER.map((entity) => {
      const renderedValue = renderCount(counts[entity]);
      const renderedTotal = totalCounts ? renderCount(totalCounts[entity]) : undefined;
      return {
        entity,
        label: t(`entities.${entity}_other`),
        value: renderedValue,
        total: renderedTotal,
        icon: COUNT_ENTITY_REGISTRY[entity].icon,
      };
    }).filter((item) => item.value !== NO_RESULTS_DASHES && item.value !== 0);
    return items.length > 0 ? items : null;
  }, [counts, totalCounts, t, renderCount]);

  if (!countsDisplay) return null;

  return (
    <Space size={[16, 8]} wrap align="center">
      {countsDisplay.map(({ entity, label, value, total, icon }) => (
        <Popover
          key={entity}
          title={label}
          content={<div style={{ maxWidth: 360 }}>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</div>}
        >
          <Space size={4} align="center" className="cursor-pointer">
            {icon}
            <Text style={{ fontSize }}>
              <span
                style={
                  totalCounts && counts && counts[entity] !== totalCounts[entity] ? { fontWeight: 600 } : undefined
                }
              >
                {renderCount(counts?.[entity])}
              </span>

              {totalCounts && counts && counts[entity] !== totalCounts[entity] && (
                <>
                  {' / '}
                  <span>{renderCount(totalCounts[entity])}</span>
                </>
              )}
            </Text>
          </Space>
        </Popover>
      ))}
    </Space>
  );
};

export default CountsDisplay;
