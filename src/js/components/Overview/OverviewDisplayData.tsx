import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { disableChart } from '@/features/data/data.store';
import { ChartDataField } from '@/types/data';
import ChartCard from './ChartCard';
import { useOverflow } from '@/hooks';

const CHART_WIDTH = 450;
const GRID_GAP = 20;

const OverviewDisplayData = ({ section, allCharts }: OverviewDisplayDataProps) => {
  const dispatch = useDispatch();
  const container = useRef<HTMLDivElement>(null);
  const isOverflow = useOverflow(container);

  useEffect(() => {
    if (isOverflow) {
      console.log('Container has overflow');
    } else {
      console.log('Container does not have overflow');
    }
  }, [isOverflow]);

  const containerStyle = {
    display: 'grid',
    gap: `${GRID_GAP}px`,
    gridTemplateColumns: `repeat(auto-fit, ${CHART_WIDTH}px)`,
  };

  const displayedCharts = useMemo(() => allCharts.filter((e) => e.isDisplayed), [allCharts]);

  const onRemoveChart = useCallback(
    ({ section, id }: { section: string; id: string }) => {
      dispatch(disableChart({ section, id }));
    },
    [dispatch]
  );

  const renderItem = (chart: ChartDataField) => {
    return (
      <ChartCard key={chart.id} chart={chart} section={section} onRemoveChart={onRemoveChart} overflow={isOverflow} />
    );
  };

  return (
    <div ref={container} style={containerStyle}>
      {displayedCharts.map(renderItem)}
    </div>
  );
};

export interface OverviewDisplayDataProps {
  section: string;
  allCharts: ChartDataField[];
}

export default OverviewDisplayData;
