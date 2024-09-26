import type { DrawerProps } from 'antd';
import { Button, Drawer, Flex, Space, Typography } from 'antd';
const { Title } = Typography;

import ChartTree from './ChartTree';

import type { ChartDataField } from '@/types/data';
import { useAppSelector, useAppDispatch, useTranslationCustom, useTranslationDefault } from '@/hooks';
import { hideAllSectionCharts, setAllDisplayedCharts, resetLayout } from '@/features/data/data.store';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const t = useTranslationCustom();
  const td = useTranslationDefault();

  const dispatch = useAppDispatch();

  const sections = useAppSelector((state) => state.data.sections);

  return (
    <Drawer
      title={td('Manage Charts')}
      placement="right"
      onClose={onManageDrawerClose}
      open={manageDrawerVisible}
      extra={
        <Space>
          <Button
            size="small"
            onClick={() => {
              dispatch(setAllDisplayedCharts({}));
            }}
          >
            Show All
          </Button>
          <Button
            size="small"
            onClick={() => {
              dispatch(resetLayout());
            }}
          >
            Reset
          </Button>
        </Space>
      }
    >
      {sections.map(({ sectionTitle, charts }: { sectionTitle: string; charts: ChartDataField[] }, i: number) => (
        <div key={i}>
          <Flex justify="space-between" align="center" style={{ padding: '10px 0' }}>
            <Title level={5} style={{ margin: '0' }}>
              {t(sectionTitle)}
            </Title>
            <Space>
              <Button
                size="small"
                onClick={() => {
                  dispatch(setAllDisplayedCharts({ section: sectionTitle }));
                }}
              >
                Show All
              </Button>
              <Button
                size="small"
                onClick={() => {
                  dispatch(hideAllSectionCharts({ section: sectionTitle }));
                }}
              >
                Hide All
              </Button>
            </Space>
          </Flex>
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
