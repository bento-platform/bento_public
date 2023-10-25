import React, { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { disableChart } from '@/features/data/data.store';
import { ChartDataField } from '@/types/data';
import ChartCard from './ChartCard';

const CHART_GUTTER = 16;

const getColumnCount = (width: number): number => {
  if (width < 880) {
    return 1;
  } else if (width < 1420) {
    return 2;
  } else return 3;
};

// Keep these quantized rather than a function of width for two reasons:
//  - makes design more predictable
//  - we don't need to re-render children for all width changes, just for some
const getFrameWidth = (width: number): number => {
  if (width < 820) {
    return 440;
  } else if (width < 1060) {
    return 780;
  } else if (width < 1420) {
    return 960;
  } else {
    return 1325;
  }
};

const OverviewDisplayData = ({ section, allCharts }: OverviewDisplayDataProps) => {
  const dispatch = useDispatch();

  const { width } = useWindowSize();
  const columnCount = getColumnCount(width);
  const frameWidth = getFrameWidth(width);

  const containerStyle = useMemo<CSSProperties>(
    () => ({ width: frameWidth, display: 'flex', flexWrap: 'wrap', gap: CHART_GUTTER }),
    [frameWidth]
  );

  const displayedCharts = useMemo(() => allCharts.filter((e) => e.isDisplayed), [allCharts]);

  const onRemoveChart = useCallback(
    ({ section, id }: { section: string; id: string }) => {
      dispatch(disableChart({ section, id }));
    },
    [dispatch]
  );

  const renderItem = useCallback(
    (chart: ChartDataField) => {
      const columnWidth = Math.min(chart.width, columnCount);
      const pixelWidth = (columnWidth / columnCount) * (frameWidth - CHART_GUTTER * (columnCount - columnWidth));
      return (
        <ChartCard key={chart.id} chart={chart} section={section} onRemoveChart={onRemoveChart} width={pixelWidth} />
      );
    },
    [section, onRemoveChart, width]
  );

  return <div style={containerStyle}>{displayedCharts.map(renderItem)}</div>;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export interface OverviewDisplayDataProps {
  section: string;
  allCharts: ChartDataField[];
}

export default OverviewDisplayData;
