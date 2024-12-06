import type { DrawerProps } from 'antd';
import { Button, Drawer, Flex, Space, Typography } from 'antd';
const { Title } = Typography;

import ChartTree from './ChartTree';

import type { ChartDataField } from '@/types/data';
import { useAppSelector, useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { hideAllSectionCharts, setAllDisplayedCharts, resetLayout } from '@/features/data/data.store';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();

  const isSmallScreen = useSmallScreen();

  const { sections } = useAppSelector((state) => state.data);

  return (
    <Drawer
      title={t('Manage Charts')}
      placement="right"
      onClose={onManageDrawerClose}
      open={manageDrawerVisible}
      // If we're on a small device, make the drawer full-screen width instead of a fixed width.
      // The default value for Ant Design is 372.
      width={isSmallScreen ? '100vw' : 420}
      extra={
        <Space>
          <Button
            size="small"
            onClick={() => {
              dispatch(setAllDisplayedCharts({}));
            }}
          >
            {t('Show All')}
          </Button>
          <Button
            size="small"
            onClick={() => {
              dispatch(resetLayout());
            }}
          >
            {t('Reset')}
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
                {t('Show All')}
              </Button>
              <Button
                size="small"
                onClick={() => {
                  dispatch(hideAllSectionCharts({ section: sectionTitle }));
                }}
              >
                {t('Hide All')}
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
