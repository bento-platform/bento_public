import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { disableChart } from '../../features/data';
import ManageChartsDrawer from './Drawer/ManageChartsDrawer';
import MakeChartCard from './MakeChartCard';
import {
  saveValue,
  convertSequenceAndDisplayData,
} from '../../utils/localStorage';
import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const OverviewDisplayData = () => {
  const dispatch = useDispatch();

  const orderedCharts = useSelector((state) => state.data.chartData);
  saveValue(
    LOCALSTORAGE_CHARTS_KEY,
    convertSequenceAndDisplayData(orderedCharts)
  );

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
            onRemoveChart={onRemoveChart}
          />
        ))}
      <ManageChartsDrawer
        onManageDrawerClose={onClose}
        manageDrawerVisible={visible}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="floating-button"
        onClick={showDrawer}
      />
    </>
  );
};

export default OverviewDisplayData;
