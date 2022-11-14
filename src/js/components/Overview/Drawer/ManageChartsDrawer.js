import React from 'react';
import { useSelector } from 'react-redux';

import { Drawer, Typography } from 'antd';
const { Title } = Typography;
import { useTranslation } from 'react-i18next';

import ChartTree from './ChartTree';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }) => {
  const { t } = useTranslation();

  const sections = useSelector((state) => state.data.sections);

  return (
    <Drawer title={t('Manage Charts')} placement="right" onClose={onManageDrawerClose} visible={manageDrawerVisible}>
      {sections.map(({ sectionTitle, charts }, i) => (
        <div key={i}>
          <Title level={5}>{t(sectionTitle)}</Title>
          <ChartTree charts={charts} section={sectionTitle} />
        </div>
      ))}
    </Drawer>
  );
};

export default ManageChartsDrawer;
