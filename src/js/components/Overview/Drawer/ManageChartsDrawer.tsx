import React from 'react';

import { Drawer, DrawerProps, Typography } from 'antd';
const { Title } = Typography;

import ChartTree from './ChartTree';

import { ChartDataField } from '@/types/data';
import { useAppSelector, useTranslationCustom, useTranslationDefault } from '@/hooks';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

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
