import { useId } from 'react';

import { Button, Flex, Segmented, Typography } from 'antd';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

import type { ChartSizeMode } from '@/features/ui/types';
import { setOverviewChartMode } from '@/features/ui/ui.store';
import { useAppDispatch } from '@/hooks';
import { useUISettings } from '@/features/ui/hooks';

const OverviewChartSizeControl = ({ showManageCharts }: { showManageCharts?: boolean }) => {
  const dispatch = useAppDispatch();
  const { overviewChartMode } = useUISettings();
  const labelId = useId();
  return (
    <Flex vertical gap={4}>
      <Flex gap={12} align="center">
        <label className="flex-1" id={labelId}>
          Chart size:
        </label>
        <Segmented<ChartSizeMode>
          aria-labelledby={labelId}
          value={overviewChartMode}
          onChange={(value) => dispatch(setOverviewChartMode(value))}
          options={[
            { value: 'normal', icon: <BsGrid />, label: 'Normal' },
            { value: 'compact', icon: <BsGrid3X3Gap />, label: 'Compact' },
          ]}
        />
      </Flex>
      <Typography.Text type="secondary" style={{ fontSize: '0.81rem' }}>
        Control chart display size and how many charts can fit on-screen.{' '}
        {showManageCharts ? (
          <>
            To alter which charts are shown,{' '}
            <Button type="link" className="p-0 h-auto" style={{ fontSize: '0.81rem' }}>
              manage charts
            </Button>
            .
          </>
        ) : null}
      </Typography.Text>
    </Flex>
  );
};

export default OverviewChartSizeControl;
