import type { ReactNode } from 'react';
import { Flex, Space, Typography } from 'antd';
import { DatabaseOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import type { DatasetSearchTotals } from '@/features/catalogue/types';
import { useFormatNumber, useTranslationFn } from '@/hooks';
import { PCGL_MODE } from '@/config';
import AboutContent from '@/components/AboutContent';
import { BANNER_GRADIENT } from './constants';

const { Text } = Typography;

const StatItem = ({ icon, value, label }: { icon: ReactNode; value: string; label: string }) => (
  <Space size={8} align="center" className="whitespace-nowrap">
    <span className="catalogue-banner__stat-icon">{icon}</span>
    <Text className="catalogue-banner__stat-value">
      {value} {label}
    </Text>
  </Space>
);

interface CatalogueBannerProps {
  /** Total datasets matching the current search/filter scope (not just the current page). */
  count: number;
  /** Censored individual/biosample counts summed across that same scope (?include=totals), or null before
   *  the first response lands. */
  totals: DatasetSearchTotals | null;
}

const CatalogueBanner = ({ count: datasetCount, totals }: CatalogueBannerProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();

  // TODO: PCGL need support from backend for this
  // { count: nWGS, entity: 'whole_genome_sequence' }
  const individualCount = totals?.individual ?? 0;
  const biosampleCount = totals?.biosample ?? 0;

  return (
    <div
      className={clsx('catalogue-banner', PCGL_MODE ? 'pcgl' : 'default')}
      style={
        PCGL_MODE
          ? {
              backgroundImage: `${BANNER_GRADIENT}, url('/public/assets/pcgl_banner.png')`,
            }
          : undefined
      }
    >
      <Flex justify="space-between" align="center" className="w-full" wrap gap={PCGL_MODE ? 16 : 24}>
        {PCGL_MODE ? (
          <Flex vertical gap={4}>
            <Text className="catalogue-banner__eyebrow">{t('pcgl.banner.eyebrow')}</Text>
            <Text className="catalogue-banner__title">{t('pcgl.banner.title')}</Text>
            <Text className="catalogue-banner__subtitle">{t('pcgl.banner.subtitle')}</Text>
          </Flex>
        ) : (
          <div className="flex-1 min-w-0">
            <AboutContent />
          </div>
        )}
        <Space size={[28, 6]} wrap>
          <StatItem
            icon={<DatabaseOutlined />}
            value={fmt(datasetCount)}
            label={t('entities.dataset', { count: datasetCount }).toLowerCase()}
          />
          <StatItem
            icon={<TeamOutlined />}
            value={fmt(individualCount)}
            label={t('entities.individual', { count: individualCount }).toLowerCase()}
          />
          <StatItem
            icon={<ExperimentOutlined />}
            value={fmt(biosampleCount)}
            label={t('entities.biosample', { count: biosampleCount }).toLowerCase()}
          />
        </Space>
      </Flex>
    </div>
  );
};

export default CatalogueBanner;
