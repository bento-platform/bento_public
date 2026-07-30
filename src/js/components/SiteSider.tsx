import { useId } from 'react';
import clsx from 'clsx';
import { Button, Flex, Layout, Segmented, Typography } from 'antd';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

import SearchForm from '@/components/Search/SearchForm';
import Sidebar from '@/components/Sidebar/Sidebar';

import { setOverviewChartMode } from '@/features/ui/ui.store';

import { useAppDispatch } from '@/hooks';

import type { ChartSizeMode } from '@/features/ui/types';

const SiteSiderFooterControls = () => {
  const dispatch = useAppDispatch();
  const labelId = useId();
  return (
    <Flex vertical gap={4}>
      <Flex gap={12} align="center">
        <label className="flex-1" id={labelId}>
          Chart size:
        </label>
        <Segmented<ChartSizeMode>
          aria-labelledby={labelId}
          onChange={(value) => dispatch(setOverviewChartMode(value))}
          options={[
            { value: 'normal', icon: <BsGrid />, label: 'Normal' },
            { value: 'compact', icon: <BsGrid3X3Gap />, label: 'Compact' },
          ]}
        />
      </Flex>
      <Typography.Text type="secondary" style={{ fontSize: '0.81rem' }}>
        Control chart display size and how many charts can fit on-screen. To alter which charts are shown,{' '}
        <Button type="link" className="p-0 h-auto" style={{ fontSize: '0.81rem' }}>
          manage charts
        </Button>
        .
      </Typography.Text>
    </Flex>
  );
};

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
  return (
    <Layout.Sider width="auto" id="site-sider" className={clsx({ overlay })}>
      <Sidebar
        className="shadow"
        id="site-sider__inner"
        overlay={overlay}
        open={open}
        onClose={onClose}
        footer={<SiteSiderFooterControls />}
      >
        <SearchForm />
      </Sidebar>
    </Layout.Sider>
  );
};

export default SiteSider;
