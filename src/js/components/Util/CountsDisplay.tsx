import { useMemo } from 'react';

import { Popover, Space } from 'antd';

import type { BentoCountEntityCountsOrBooleans } from '@/types/entities';
import { COUNT_ENTITY_ORDER, COUNT_ENTITY_REGISTRY } from '@/constants/countEntities';
import { useTranslationFn } from '@/hooks';
import { useRenderCount } from '@/hooks/counts';
import { NO_RESULTS_DASHES } from '@/features/search/constants';
import CountItem from './CountItem';

interface CountsDisplayProps {
  counts?: BentoCountEntityCountsOrBooleans;
  totalCounts?: BentoCountEntityCountsOrBooleans;
}

const CountsDisplay = ({ counts, totalCounts }: CountsDisplayProps) => {
  const t = useTranslationFn();
  const renderCount = useRenderCount();

  const countsDisplay = useMemo(() => {
    if (!counts) return null;
    const items = COUNT_ENTITY_ORDER.map((entity) => {
      const renderedValue = renderCount(counts[entity]);
      const renderedTotal = totalCounts ? renderCount(totalCounts[entity]) : undefined;
      const isFiltered = totalCounts ? counts[entity] !== totalCounts[entity] : false;
      return {
        entity,
        label: t(`entities.${entity}_other`),
        value: renderedValue,
        total: renderedTotal,
        isFiltered,
        icon: COUNT_ENTITY_REGISTRY[entity].icon,
      };
    }).filter((item) => item.isFiltered || (item.value !== NO_RESULTS_DASHES && item.value !== 0));
    return items.length > 0 ? items : null;
  }, [counts, totalCounts, t, renderCount]);

  if (!countsDisplay) return null;

  return (
    <Space size={[16, 8]} wrap align="center">
      {countsDisplay.map(({ entity, label, icon, value, total, isFiltered }) => (
        <Popover
          key={entity}
          title={label}
          content={<div style={{ maxWidth: 360 }}>{t(`entities.${entity}_help`, { joinArrays: ' ' })}</div>}
        >
          <CountItem
            icon={icon}
            value={
              isFiltered ? (
                <>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                  {' / '}
                  <span>{total}</span>
                </>
              ) : (
                value
              )
            }
          />
        </Popover>
      ))}
    </Space>
  );
};

export default CountsDisplay;
