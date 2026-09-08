import { Flex, Segmented, Typography } from 'antd';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';

import type { ChartSizeMode } from '@/features/ui/types';
import { setExploreChartMode } from '@/features/ui/ui.store';
import { useAppDispatch, useTranslationFn } from '@/hooks';
import { useUiSettings } from '@/features/ui/hooks';

const ExploreChartSizeControl = () => {
  const dispatch = useAppDispatch();
  const t = useTranslationFn();

  const { exploreChartMode } = useUiSettings();

  return (
    <Flex vertical gap={4}>
      <Flex gap={12} align="center">
        <Typography.Title level={5} className="flex-1 mb-0">
          {t('explore.chart_size_label')}
        </Typography.Title>
        <Segmented<ChartSizeMode>
          value={exploreChartMode}
          onChange={(value) => dispatch(setExploreChartMode(value))}
          options={[
            { value: 'normal', icon: <BsGrid aria-hidden />, label: t('explore.normal') },
            { value: 'compact', icon: <BsGrid3X3Gap aria-hidden />, label: t('explore.compact') },
          ]}
        />
      </Flex>
      <Typography.Text style={{ fontSize: '0.81rem' }}>{t('explore.chart_size_help')}</Typography.Text>
    </Flex>
  );
};

export default ExploreChartSizeControl;
