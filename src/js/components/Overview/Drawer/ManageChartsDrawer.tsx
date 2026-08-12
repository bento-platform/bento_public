import { Button, type DrawerProps, Drawer, Flex, Grid, Space, Typography } from 'antd';

const { Title } = Typography;
const { useBreakpoint } = Grid;

import type { Section } from '@/types/data';

import ChartTree from './ChartTree';
import OverviewChartSizeControl from '@/components/Overview/Util/OverviewChartSizeControl';

import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { hideAllSectionCharts, setAllDisplayedCharts, resetLayout } from '@/features/search/query.store';
import { useSearchQuery } from '@/features/search/hooks';
import { useCallback } from 'react';

const ManageChartsSectionHeader = ({
  section: { sectionId, sectionTitle },
  first,
}: {
  section: Section;
  first: boolean;
}) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();

  return (
    <Flex justify="space-between" align="center" className={first ? 'mb-3' : 'my-3'}>
      <Title level={5} style={{ margin: '0' }}>
        {t(sectionTitle)}
      </Title>
      <Space>
        <Button
          size="small"
          onClick={() => {
            dispatch(setAllDisplayedCharts({ section: sectionId }));
          }}
        >
          {t('Show All')}
        </Button>
        <Button
          size="small"
          onClick={() => {
            dispatch(hideAllSectionCharts({ section: sectionId }));
          }}
        >
          {t('Hide All')}
        </Button>
      </Space>
    </Flex>
  );
};

const ManageChartsDrawer = ({ onManageDrawerClose, manageDrawerVisible }: ManageChartsDrawerProps) => {
  const t = useTranslationFn();

  const dispatch = useAppDispatch();

  const breakpoints = useBreakpoint();
  const isSmallScreen = useSmallScreen();

  const { sections } = useSearchQuery();

  const showAll = useCallback(() => {
    dispatch(setAllDisplayedCharts({}));
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetLayout());
  }, [dispatch]);

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
      styles={{ body: { padding: 0, display: 'grid', gridTemplateRows: 'auto min-content' } }}
      extra={
        <Space>
          <Button size="small" onClick={showAll}>
            {t('Show All')}
          </Button>
          <Button size="small" onClick={reset}>
            {t('Reset')}
          </Button>
        </Space>
      }
    >
      <div className="p-ant-lg overflow-y-auto">
        {sections.map((section, i) => {
          const { sectionId, charts } = section;
          return (
            <div key={sectionId}>
              <ManageChartsSectionHeader section={section} first={i === 0} />
              <ChartTree charts={charts} section={sectionId} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: 'var(--ant-padding) var(--ant-padding-lg) var(--ant-padding-lg) var(--ant-padding-lg)',
          borderTop: '1px solid var(--ant-color-split)',
        }}
      >
        <OverviewChartSizeControl />
      </div>
    </Drawer>
  );
};

export interface ManageChartsDrawerProps {
  onManageDrawerClose: DrawerProps['onClose'];
  manageDrawerVisible: boolean;
}

export default ManageChartsDrawer;
