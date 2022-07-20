import React from 'react';
import { useDispatch } from 'react-redux';

import MakeChartCard from './MakeChartCard';
import { disableChart } from '../../features/data/data';

const OverviewDisplayData = ({ section, allCharts }) => {
  const dispatch = useDispatch();

  const orderedCharts = allCharts;

  const onRemoveChart = ({ section, id }) => {
    dispatch(disableChart({ section, id }));
  };

  return (
    <>
      {orderedCharts
        .filter((e) => e.isDisplayed)
        .map((chart) => (
          <MakeChartCard
            key={chart.name}
            chart={chart}
            section={section}
            onRemoveChart={onRemoveChart}
          />
        ))}
    </>
  );
};

export default OverviewDisplayData;
