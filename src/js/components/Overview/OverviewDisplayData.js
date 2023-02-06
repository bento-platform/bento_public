import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'antd';

import MakeChartCard from './MakeChartCard';
import { disableChart } from '../../features/data/data';

const getColumnCount = (width) => {
  if (width < 990) {
    return 1;
  } else if (width < 1420) {
    return 2;
  } else return 3;
};

const getframeWidth = (width) => {
  if (width < 990) {
    return 360;
  } else if (width < 1420) {
    return 910;
  } else return 1325;
};

const OverviewDisplayData = ({ section, allCharts }) => {
  const dispatch = useDispatch();

  const { width } = useWindowSize();

  const orderedCharts = allCharts;

  const onRemoveChart = ({ section, id }) => {
    dispatch(disableChart({ section, id }));
  };

  return (
    <List
      style={{ width: `${getframeWidth(width)}px` }}
      grid={{ gutter: 0, column: getColumnCount(width) }}
      dataSource={orderedCharts.filter((e) => e.isDisplayed)}
      renderItem={(chart) => (
        <MakeChartCard key={chart.name} chart={chart} section={section} onRemoveChart={onRemoveChart} />
      )}
    />
  );
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
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

export default OverviewDisplayData;
