import { useCallback, useMemo } from 'react';

import { disableChart } from '@/features/search/query.store';
import { useAppDispatch } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { useDashboardChartDimensions } from '@/features/ui/hooks';

import { Space } from 'antd';
import ChartCard from './ChartCard';

import type { ChartDataField } from '@/types/data';

import { getChartCssWidth } from '@/utils/chart';

const OverviewDisplayData = ({ section, allCharts, searchableFields }: OverviewDisplayDataProps) => {
  const dispatch = useAppDispatch();
  const isSmallScreen = useSmallScreen();
  const { nColumns, gridGap } = useDashboardChartDimensions();

  const containerStyle = useMemo(
    () => ({
      display: 'grid',
      gap: `${gridGap}px`,
      gridTemplateColumns: `repeat(auto-fit, calc${getChartCssWidth(nColumns, gridGap)})`,
    }),
    [nColumns, gridGap]
  );

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
