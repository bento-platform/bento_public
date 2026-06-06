import { useMemo } from 'react';
import { Flex, Space, Typography } from 'antd';
import { DatabaseOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import type { DatasetWithProject } from '@/features/catalogue/hooks';
import { useTranslationFn } from '@/hooks';
import { PCGL_MODE } from '@/config';
import AboutContent from '@/components/AboutContent';

const { Text } = Typography;

const StatItem = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <Space size={6} align="center">
    <span className="catalogue-banner__stat-icon">{icon}</span>
    <Flex vertical gap={0}>
      <Text className="catalogue-banner__stat-value">{value}</Text>
      <Text className="catalogue-banner__stat-label" type="secondary">{label}</Text>
    </Flex>
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
      style={PCGL_MODE ? { backgroundImage: `linear-gradient(90deg, rgba(4,30,48,0.80), rgba(4,30,48,0.34)), url('/public/assets/banner-bg.png')` } : undefined}
    >
      <Flex justify="space-between" align="center" style={{ height: '100%' }} wrap gap={PCGL_MODE ? 16 : 24}>
        {PCGL_MODE ? (
          <Flex vertical gap={4}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {t('PAN-CANADIAN GENOME LIBRARY')}
            </Text>
            <Text style={{ color: '#fff', fontSize: 23, fontWeight: 600, lineHeight: 1.2 }}>{t('Data Catalogue')}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13.5 }}>
              {t('Explore datasets from the Pan-Canadian Genome Library')}
            </Text>
          </Flex>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <AboutContent />
          </div>
        )}
        <Space size={28} wrap>
          <StatItem icon={<DatabaseOutlined />} value={fmt(datasetCount)} label={t(datasetCount === 1 ? 'dataset' : 'datasets')} />
          <StatItem icon={<TeamOutlined />} value={fmt(individualCount)} label={t('individuals')} />
          <StatItem icon={<ExperimentOutlined />} value={fmt(biosampleCount)} label={t('biosamples')} />
        </Space>
      </Flex>
    </div>
  );
};

export default CatalogueBanner;
