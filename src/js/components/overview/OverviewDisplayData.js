import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { disableChart, rearrange } from '../../features/data';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import MakeChartCard from './MakeChartCard';
import NewChartCard from './NewChartCard';

const OverviewDisplayData = () => {
  const dispatch = useDispatch();

  const orderedCharts = useSelector((state) => state.data.chartData);

  const onMoveChartUp = (chartName) => {
    let temp = [...orderedCharts.map((e) => e.name)];
    const i = temp.findIndex((e) => e === chartName);
    if (i === 0) return;
    const tempValue = temp[i];
    temp[i] = temp[i - 1];
    temp[i - 1] = tempValue;
    console.log('temppppp', temp);
    dispatch(rearrange(temp));
  };

  const onMoveChartDown = (chartName) => {
    let temp = [...orderedCharts.map((e) => e.name)];
    const i = temp.findIndex((e) => e === chartName);
    if (i === temp.length - 1) return;
    const tempValue = temp[i];
    temp[i] = temp[i + 1];
    temp[i + 1] = tempValue;
    dispatch(rearrange(temp));
  };

  const onRemoveChart = (chartName) => {
    dispatch(disableChart(chartName));
  };

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      {orderedCharts
        .filter((e) => e.isDisplayed)
        .map((chart) => (
          <MakeChartCard
            key={chart.name}
            chart={chart}
            onMoveChartUp={onMoveChartUp}
            onMoveChartDown={onMoveChartDown}
            onRemoveChart={onRemoveChart}
            onShowDrawer={showDrawer}
          />
        ))}
      <NewChartCard onClick={showDrawer} />
      <ManageChartsDrawer
        onManageDrawerClose={onClose}
        manageDrawerVisible={visible}
      />
    </>
  );
};

export default OverviewDisplayData;
