import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'antd';

import ChartCard from './ChartCard';
import { disableChart } from '@/features/data/data.store';
import { ChartDataField } from '@/types/data';

const getColumnCount = (width: number): number => {
  if (width < 990) {
    return 1;
  } else if (width < 1420) {
    return 2;
  } else return 3;
};

const getFrameWidth = (width: number): number => {
  if (width < 990) {
    return 360;
  } else if (width < 1420) {
    return 910;
  } else return 1325;
};

const OverviewDisplayData = ({ section, allCharts }: OverviewDisplayDataProps) => {
  const dispatch = useDispatch();

  const { width } = useWindowSize();

  const [listStyle, listGrid] = useMemo(
    () => [{ width: `${getFrameWidth(width)}px` }, { gutter: 0, column: getColumnCount(width) }],
    [width]
  );

  const displayedCharts = useMemo(() => allCharts.filter((e) => e.isDisplayed), [allCharts]);

  const onRemoveChart = useCallback(
    ({ section, id }: { section: string; id: string }) => {
      dispatch(disableChart({ section, id }));
    },
    [dispatch]
  );

  const renderItem = useCallback(
    (chart: ChartDataField) => (
      <ChartCard key={chart.id} chart={chart} section={section} onRemoveChart={onRemoveChart} />
    ),
    [section, onRemoveChart]
  );

  return <List style={listStyle} grid={listGrid} dataSource={displayedCharts} renderItem={renderItem} />;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
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
