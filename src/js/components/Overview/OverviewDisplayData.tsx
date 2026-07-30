import { useCallback, useMemo } from 'react';
import { Space } from 'antd';

import { disableChart } from '@/features/search/query.store';
import { useAppDispatch } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';

import { GRID_GAP } from '@/constants/overviewConstants';

import ChartCard from './ChartCard';

import type { ChartSizeMode } from '@/features/ui/types';
import type { ChartDataField } from '@/types/data';
// import { getChartCssWidth } from '@/utils/chart';

const OverviewDisplayData = ({ section, allCharts, searchableFields, chartMode }: OverviewDisplayDataProps) => {
  const dispatch = useAppDispatch();
  const isSmallScreen = useSmallScreen();

  const containerStyle = {
    display: 'grid',
    gap: chartMode === 'compact' ? '1px' : `${GRID_GAP}px`,
    // gridTemplateColumns: `repeat(auto-fit, calc(${getChartCssWidth(3, GRID_GAP)}))`,
    gridTemplateColumns: `repeat(auto-fill, minmax(${chartMode === 'compact' ? '300' : '350'}px, 1fr))`,
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
        mode={chartMode}
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
  chartMode: ChartSizeMode;
}

export default OverviewDisplayData;
