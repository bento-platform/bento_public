import { Flex, Segmented, Typography } from 'antd';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

import type { ChartSizeMode } from '@/features/ui/types';
import { setOverviewChartMode } from '@/features/ui/ui.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useUiSettings } from '@/features/ui/hooks';

const OverviewChartSizeControl = () => {
  const dispatch = useAppDispatch();
  const t = useTranslationFn();

  const { overviewChartMode } = useUiSettings();

  return (
    <Flex vertical gap={4}>
      <Flex gap={12} align="center">
        <Typography.Title level={5} className="flex-1 mb-0">
          {t('overview.chart_size_label')}
        </Typography.Title>
        <Segmented<ChartSizeMode>
          value={overviewChartMode}
          onChange={(value) => dispatch(setOverviewChartMode(value))}
          options={[
            { value: 'normal', icon: <BsGrid />, label: t('overview.normal') },
            { value: 'compact', icon: <BsGrid3X3Gap />, label: t('overview.compact') },
          ]}
        />
      </Flex>
      <Typography.Text style={{ fontSize: '0.81rem' }}>{t('overview.chart_size_help')}</Typography.Text>
    </Flex>
  );
};

export default OverviewChartSizeControl;
