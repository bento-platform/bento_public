import React from 'react';
import { useSelector } from 'react-redux';

import { Drawer, Typography } from 'antd';
const { Title } = Typography;

import ChartTree from './ChartTree';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }) => {
  const sections = useSelector((state) => state.data.sections);

  return (
    <Drawer
      title="Manage Charts"
      placement="right"
      onClose={onManageDrawerClose}
      visible={manageDrawerVisible}
    >
      {sections.map(({ sectionTitle, charts }, i) => (
        <div key={i}>
          <Title level={5}>{sectionTitle}</Title>
          <ChartTree charts={charts} section={sectionTitle} />
        </div>
      ))}
    </Drawer>
  );
};

export default ManageChartsDrawer;
