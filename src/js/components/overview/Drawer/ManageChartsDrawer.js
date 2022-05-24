import React from 'react';
import { Drawer } from 'antd';
import ChartTree from './chartTree';

const ManageChartsDrawer = ({
  onManageDrawerClose,
  manageDrawerVisible,
  allCharts,
}) => {
  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      onClose={onManageDrawerClose}
      visible={manageDrawerVisible}
    >
      <ChartTree allCharts={allCharts} />
    </Drawer>
  );
};

export default ManageChartsDrawer;
