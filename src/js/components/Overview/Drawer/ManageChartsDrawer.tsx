import React from 'react';

import { Drawer, DrawerProps, Typography } from 'antd';
const { Title } = Typography;
import { useTranslation } from 'react-i18next';

import ChartTree from './ChartTree';

import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { ChartDataField } from '@/types/data';
import { useAppSelector } from '@/hooks';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);
  const { t: td } = useTranslation(DEFAULT_TRANSLATION);

  const sections = useAppSelector((state) => state.data.sections);

  return (
    <Drawer title={td('Manage Charts')} placement="right" onClose={onManageDrawerClose} open={manageDrawerVisible}>
      {sections.map(({ sectionTitle, charts }: { sectionTitle: string; charts: ChartDataField[] }, i: number) => (
        <div key={i}>
          <Title level={5}>{t(sectionTitle)}</Title>
          <ChartTree charts={charts} section={sectionTitle} />
        </div>
      ))}
    </Drawer>
  );
};

export interface ManageChartsDrawerProps {
  onManageDrawerClose: DrawerProps['onClose'];
  manageDrawerVisible: boolean;
}

export default ManageChartsDrawer;
