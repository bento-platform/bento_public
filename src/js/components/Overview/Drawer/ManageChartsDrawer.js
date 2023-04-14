import React from 'react';
import { useSelector } from 'react-redux';

import { Drawer, Typography } from 'antd';
const { Title } = Typography;
import { useTranslation } from 'react-i18next';

import ChartTree from './ChartTree';

import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '../../../constants/configConstants';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  const sections = useSelector((state) => state.data.sections);

  return (
    <Drawer title={td('Manage Charts')} placement="right" onClose={onManageDrawerClose} open={manageDrawerVisible}>
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
