import { useId } from 'react';

import { Button, Flex, Segmented, Typography } from 'antd';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

import type { ChartSizeMode } from '@/features/ui/types';
import { setOverviewChartMode } from '@/features/ui/ui.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useUISettings } from '@/features/ui/hooks';

const OverviewChartSizeControl = ({ showManageCharts }: { showManageCharts?: boolean }) => {
  const dispatch = useAppDispatch();
  const t = useTranslationFn();
  const { overviewChartMode } = useUISettings();
  const labelId = useId();
  return (
    <Flex vertical gap={4}>
      <Flex gap={12} align="center">
        <label className="flex-1" id={labelId}>
          {t('overview.chart_size_label')}
        </label>
        <Segmented<ChartSizeMode>
          aria-labelledby={labelId}
          value={overviewChartMode}
          onChange={(value) => dispatch(setOverviewChartMode(value))}
          options={[
            { value: 'normal', icon: <BsGrid />, label: t('overview.normal') },
            { value: 'compact', icon: <BsGrid3X3Gap />, label: t('overview.compact') },
          ]}
        />
      </Flex>
      <Typography.Text type="secondary" style={{ fontSize: '0.81rem' }}>
        {t('overview.chart_size_help')}{' '}
        {showManageCharts ? (
          <>
            {t('overview.alter_shown_charts')}{' '}
            <Button type="link" className="p-0 h-auto" style={{ fontSize: '0.81rem' }}>
              {t('overview.manage_charts_link')}
            </Button>
            .
          </>
        ) : null}
      </Typography.Text>
    </Flex>
  );
};

export default OverviewChartSizeControl;
