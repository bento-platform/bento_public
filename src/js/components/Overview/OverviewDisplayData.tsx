import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { disableChart } from '@/features/data/data.store';
import { ChartDataField } from '@/types/data';
import ChartCard from './ChartCard';

const CHART_WIDTH = 450;
const GRID_GAP = 20;

const OverviewDisplayData = ({ section, allCharts }: OverviewDisplayDataProps) => {
  const dispatch = useDispatch();

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
    return <ChartCard key={chart.id} chart={chart} section={section} onRemoveChart={onRemoveChart} />;
  };

  return <div style={containerStyle}>{displayedCharts.map(renderItem)}</div>;
};

export interface OverviewDisplayDataProps {
  section: string;
  allCharts: ChartDataField[];
}

export default OverviewDisplayData;
