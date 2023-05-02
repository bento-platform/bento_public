import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'antd';

import MakeChartCard from './MakeChartCard';
import { disableChart } from '@/features/data/data.store';
import { ChartDataField } from '@/types/data';

const getColumnCount = (width: number): number => {
  if (width < 990) {
    return 1;
  } else if (width < 1420) {
    return 2;
  } else return 3;
};

const getframeWidth = (width: number): number => {
  if (width < 990) {
    return 360;
  } else if (width < 1420) {
    return 910;
  } else return 1325;
};

const OverviewDisplayData = ({ section, allCharts }: OverviewDisplayDataProps) => {
  const dispatch = useDispatch();

  const { width } = useWindowSize();

  const orderedCharts = allCharts;

  const onRemoveChart = ({ section, id }: { section: string; id: string }) => {
    dispatch(disableChart({ section, id }));
  };

  return (
    <List
      style={{ width: `${getframeWidth(width)}px` }}
      grid={{ gutter: 0, column: getColumnCount(width) }}
      dataSource={orderedCharts.filter((e) => e.isDisplayed)}
      renderItem={(chart) => (
        <MakeChartCard key={chart.id} chart={chart} section={section} onRemoveChart={onRemoveChart} />
      )}
    />
  );
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
