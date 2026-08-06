import { Button, Divider, type DrawerProps, Drawer, Flex, Grid, Space, Typography } from 'antd';

const { Title } = Typography;
const { useBreakpoint } = Grid;

import ChartTree from './ChartTree';
import OverviewChartSizeControl from '@/components/Overview/Util/OverviewChartSizeControl';

import type { ChartDataField } from '@/types/data';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { hideAllSectionCharts, setAllDisplayedCharts, resetLayout } from '@/features/search/query.store';
import { useSearchQuery } from '@/features/search/hooks';

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();

  const breakpoints = useBreakpoint();
  const isSmallScreen = useSmallScreen();

  const { sections } = useSearchQuery();

  return (
    <Drawer
      title={t('Manage Charts')}
      placement={
        // If we're on a larger screen, the sidebar 'Manage Charts' button will be used from the left.
        // Otherwise, it'll be the float button from the right.
        breakpoints.lg ? 'left' : 'right'
      }
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
      <Divider />
      <OverviewChartSizeControl />
    </Drawer>
  );
};

export interface ManageChartsDrawerProps {
  onManageDrawerClose: DrawerProps['onClose'];
  manageDrawerVisible: boolean;
}

export default ManageChartsDrawer;
