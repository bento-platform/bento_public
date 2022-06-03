import React from 'react';
import { Drawer } from 'antd';
import ChartTree from './ChartTree';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }) => {
  return (
    <Drawer
      title="Manage Charts"
      placement="right"
      onClose={onManageDrawerClose}
      visible={manageDrawerVisible}
    >
      <ChartTree />
    </Drawer>
  );
};

export default ManageChartsDrawer;
