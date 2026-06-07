import { useMemo } from 'react';
import { Flex, Space, Typography } from 'antd';
import { DatabaseOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import type { DatasetWithProject } from '@/features/catalogue/hooks';
import { useTranslationFn } from '@/hooks';
import { PCGL_MODE } from '@/config';
import AboutContent from '@/components/AboutContent';
import { BANNER_GRADIENT, COLOR_BANNER_EYEBROW, COLOR_BANNER_TITLE, COLOR_BANNER_SUBTITLE } from './constants';

const { Text } = Typography;

const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <Space size={8} align="center" style={{ whiteSpace: 'nowrap' }}>
    <span className="catalogue-banner__stat-icon">{icon}</span>
    <Text className="catalogue-banner__stat-value">
      {value} {label}
    </Text>
  </Space>
);

interface CatalogueBannerProps {
  filteredDatasets: DatasetWithProject[];
}

const fmt = (n: number) => n.toLocaleString('en-US');

const CatalogueBanner = ({ filteredDatasets }: CatalogueBannerProps) => {
  const t = useTranslationFn();

  const { datasetCount, individualCount, biosampleCount } = useMemo(() => {
    let individualCount = 0;
    let biosampleCount = 0;
    for (const { dataset } of filteredDatasets) {
      const counts = dataset.counts_by_entity;
      if (counts) {
        individualCount += typeof counts.individual === 'number' ? counts.individual : 0;
        biosampleCount += typeof counts.biosample === 'number' ? counts.biosample : 0;
        // TODO: PCGL need support from backend for this
        // { count: nWGS, entity: 'whole_genome_sequence' }
      }
    }
    return { datasetCount: filteredDatasets.length, individualCount, biosampleCount };
  }, [filteredDatasets]);

  return (
    <div
      className={clsx('catalogue-banner', PCGL_MODE ? 'pcgl' : 'default')}
      style={
        PCGL_MODE
          ? {
              backgroundImage: `${BANNER_GRADIENT}, url('/public/assets/banner-bg.png')`,
            }
          : undefined
      }
    >
      <Flex justify="space-between" align="center" style={{ width: '100%' }} wrap gap={PCGL_MODE ? 16 : 24}>
        {PCGL_MODE ? (
          <Flex vertical gap={4}>
            <Text
              style={{
                color: COLOR_BANNER_EYEBROW,
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {t('pcgl.banner.eyebrow')}
            </Text>
            <Text style={{ color: COLOR_BANNER_TITLE, fontSize: 23, fontWeight: 600, lineHeight: 1.2 }}>
              {t('pcgl.banner.title')}
            </Text>
            <Text style={{ color: COLOR_BANNER_SUBTITLE, fontSize: 13.5 }}>{t('pcgl.banner.subtitle')}</Text>
          </Flex>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <AboutContent />
          </div>
        )}
        <Space size={28} wrap>
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
