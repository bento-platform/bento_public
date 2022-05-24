import React, { useState } from 'react';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import MakeChartCard from './MakeChartCard';
import NewChartCard from './NewChartCard';

const OverviewDisplayData = ({ allCharts }) => {
  const [orderedCharts, setOrderedCharts] = useState(allCharts);

  console.log('ordered charts = ', orderedCharts);

  const onMoveChartUp = (chartName) => {
    let temp = [...orderedCharts];
    const i = temp.findIndex((e) => e.name === chartName);
    if (i === 0) return;
    const tempValue = temp[i];
    temp[i] = temp[i - 1];
    temp[i - 1] = tempValue;

    setOrderedCharts(temp);
  };

  const onMoveChartDown = (chartName) => {
    let temp = [...orderedCharts];
    const i = temp.findIndex((e) => e.name === chartName);
    if (i === temp.length - 1) return;
    const tempValue = temp[i];
    temp[i] = temp[i + 1];
    temp[i + 1] = tempValue;

    setOrderedCharts(temp);
  };

  const onRemoveChart = (chartName) => {
    setOrderedCharts(orderedCharts.filter((e) => e.name !== chartName));
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
      {orderedCharts.map((chart) => (
        <MakeChartCard
          key={chart.name}
          chart={chart}
          onMoveChartUp={onMoveChartUp}
          onMoveChartDown={onMoveChartDown}
          onRemoveChart={onRemoveChart}
        />
      ))}
      <NewChartCard onClick={showDrawer} />
      <ManageChartsDrawer
        onManageDrawerClose={onClose}
        manageDrawerVisible={visible}
        allCharts={allCharts.map((e) => ({
          name: e.name,
        }))}
      />
    </>
  );
};

export default OverviewDisplayData;
