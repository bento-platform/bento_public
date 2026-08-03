import { useMemo } from 'react';

import { Card, Flex, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

import { useCatalogueState } from '@/features/catalogue/hooks';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useFormatNumber, useTranslationFn } from '@/hooks';

import type { FacetId } from '@/features/catalogue/catalogue.store';
import type { DatasetWithProject } from '@/features/catalogue/hooks';

import { CategoryDonut, CategoryBarList, type HexColor, type CategoricalChartDataItem } from 'bento-charts';

import { FACET_CONFIG_BY_ID, type FacetConfig } from '@/features/catalogue/facetRegistry';
import { PCGL_MODE } from '@/config';
import { STATUS_CHART_COLORS } from './constants';

import { assignColors } from '@/features/catalogue/hooks';
import { facetLabelI18nKey } from '@/features/catalogue/utils';

function buildCounts(datasets: DatasetWithProject[], facet: FacetConfig): CategoricalChartDataItem[] {
  const map = new Map<string, number>();
  for (const d of datasets) {
    for (const v of facet.getValues(d)) {
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
  }
  return [...map.entries()].map(([x, y]) => ({ x, y, id: x })).sort((a, b) => b.y - a.y);
}

// buildCounts keeps `id` as the raw facet value (needed for toggleFacetValue/colorsById lookups); this applies
// a display translation to `x` only, so labels shown in the chart/legend are localized without losing that key.
const useTranslatedEntries = (datasets: DatasetWithProject[], facetId: FacetId): CategoricalChartDataItem[] => {
  const t = useTranslationFn();
  return useMemo<CategoricalChartDataItem[]>(() => {
    const facetConfig = FACET_CONFIG_BY_ID[facetId];
    if (facetConfig) {
      const data = buildCounts(datasets, facetConfig);
      return data.map((d) => ({ ...d, x: t(facetLabelI18nKey(facetConfig.i18nKeyPrefix, d.id ?? d.x)) }));
    } else {
      return []; // If facet config is disabled (e.g., project for PCGL)
    }
  }, [t, datasets, facetId]);
};

interface CatalogueInsightCardProps {
  datasets: DatasetWithProject[];
  facet: FacetId;
  kind: 'bar' | 'donut';
  colors?: Record<string, HexColor>;
}

const CatalogueInsightCard = ({ datasets, facet, kind, colors }: CatalogueInsightCardProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();

  const { sets } = useCatalogueState();
  const { toggleFacetValue } = useCatalogueUrlActions();

  const centerLabel = t('entities.dataset', { count: datasets.length }).toLowerCase();
  let data = useTranslatedEntries(datasets, facet);
  if (kind === 'bar') {
    data = data.slice(0, 5);
  }

  if (data.length === 0) return null;

  const commonProps = {
    data,
    colorsById: colors ?? (assignColors(data.map((d) => d.id ?? d.x)) as Record<string, HexColor>),
    selectedIds: sets[facet],
    formatValue: fmt,
    onClick: (id: string) => toggleFacetValue(facet, id),
  };

  return (
    <Card size="small" className="chart-card">
      <Text className="chart-card__title">{t(`catalogue.insights.by_${facet}`)}</Text>
      {kind === 'donut' ? (
        <CategoryDonut {...commonProps} centerLabel={centerLabel} />
      ) : (
        <CategoryBarList {...commonProps} />
      )}
    </Card>
  );
};

interface CatalogueInsightsProps {
  filteredDatasets: DatasetWithProject[];
}

const CatalogueInsights = ({ filteredDatasets }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const { projectColors } = useCatalogueState();

  return (
    <div className="catalogue-insights">
      <Flex justify="space-between" align="center" className="mb-3">
        <Flex align="center" gap={6}>
          <BarChartOutlined className="text-secondary" />
          <Text className="catalogue-insights__header-title">{t('catalogue.insights.title')}</Text>
        </Flex>
        <Text className="catalogue-insights__hint">{t('catalogue.insights.hint')}</Text>
      </Flex>
      <Flex gap={12} wrap className="items-stretch">
        <CatalogueInsightCard datasets={filteredDatasets} facet="status" kind="donut" colors={STATUS_CHART_COLORS} />
        {PCGL_MODE ? (
          <CatalogueInsightCard datasets={filteredDatasets} facet="domain" kind="bar" />
        ) : (
          <CatalogueInsightCard datasets={filteredDatasets} facet="project" kind="donut" colors={projectColors} />
        )}
        <CatalogueInsightCard datasets={filteredDatasets} facet="keyword" kind="bar" />
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
