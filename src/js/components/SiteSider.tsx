import { useCallback } from 'react';
import { Button, Flex, Grid, Typography } from 'antd';
import { AppstoreAddOutlined, CloseOutlined } from '@ant-design/icons';

import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useAvailableChartSections } from '@/features/search/hooks';
import { setManageChartsVisible } from '@/features/ui/ui.store';

import SearchForm from '@/components/Search/SearchForm';
import Sidebar from '@/components/Sidebar/Sidebar';

const { useBreakpoint } = Grid;

const SiteSider = ({
  overlay,
  open,
  onClose,
}: {
  /** Below some breakpoint, the sider renders as a fixed slide-over drawer instead of an inline sticky column. */
  overlay: boolean;
  /** Ignored when `overlay` is falsy (the sider is always visible inline). */
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const t = useTranslationFn();

  const breakpoints = useBreakpoint();

  const availableChartSections = useAvailableChartSections();

  const onManageChartsOpen = useCallback(() => dispatch(setManageChartsVisible(true)), [dispatch]);

  return (
    <Sidebar
      className="shadow"
      id="site-sider__inner"
      overlay={overlay}
      open={open}
      onClose={onClose}
      footer={
        breakpoints.lg &&
        availableChartSections.length > 0 && (
          <Flex vertical gap={8}>
            <Button
              icon={<AppstoreAddOutlined aria-hidden rotate={270} />}
              onClick={onManageChartsOpen}
              className="w-full"
              htmlType="button"
            >
              {t('Manage Charts')}
            </Button>
            <Typography.Text type="secondary" style={{ fontSize: '0.81rem' }}>
              {t('explore.manage_charts_help')}
            </Typography.Text>
          </Flex>
        )
      }
    >
      {overlay && (
        <div className="site-sider__header">
          <h2>{t('catalogue.rail.title')}</h2>
          <button className="sidebar__close focus-ring" onClick={onClose} aria-label={t('catalogue.rail.close')}>
            <CloseOutlined aria-disabled />
          </button>
        </div>
      )}
      <SearchForm />
    </Sidebar>
  );
};

export default SiteSider;
