import { useCallback, useMemo } from 'react';
import { Space } from 'antd';

import { disableChart } from '@/features/data/data.store';
import { useAppDispatch } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import { CHART_WIDTH, GRID_GAP } from '@/constants/overviewConstants';

import ChartCard from './ChartCard';

import type { ChartDataField } from '@/types/data';

const OverviewDisplayData = ({ section, allCharts, searchableFields }: OverviewDisplayDataProps) => {
  const dispatch = useAppDispatch();
  const isSmallScreen = useSmallScreen();

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
      <ChartCard
        key={chart.id}
        chart={chart}
        section={section}
        onRemoveChart={onRemoveChart}
        searchable={searchableFields.has(chart.id)}
      />
    );
  };

  if (isSmallScreen) {
    return (
      <Space direction="vertical" className="w-full">
        {displayedCharts.map(renderItem)}
      </Space>
    );
  }

  return <div style={containerStyle}>{displayedCharts.map(renderItem)}</div>;
};

export interface OverviewDisplayDataProps {
  section: string;
  allCharts: ChartDataField[];
  searchableFields: Set<string>;
}

export default OverviewDisplayData;
