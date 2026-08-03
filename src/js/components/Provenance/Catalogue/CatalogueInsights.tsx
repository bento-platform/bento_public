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

interface CatalogueInsightsProps {
  filteredDatasets: DatasetWithProject[];
}

const CatalogueInsights = ({ filteredDatasets }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();
  const { sets, projectColors } = useCatalogueState();
  const { toggleFacetValue } = useCatalogueUrlActions();

  const statusData = useTranslatedEntries(filteredDatasets, 'status');
  const domainData = useTranslatedEntries(filteredDatasets, 'domain');
  const projectData = useTranslatedEntries(filteredDatasets, 'project');
  const keywordData = useTranslatedEntries(filteredDatasets, 'keyword');

  const domainColors = assignColors(domainData.map((d) => d.id ?? d.x)) as Record<string, HexColor>;
  const keywordColors = assignColors(keywordData.slice(0, 5).map((d) => d.id ?? d.x)) as Record<string, HexColor>;

  const handleClick = (facetId: FacetId) => (id: string) => {
    toggleFacetValue(facetId, id);
  };

  const centerLabel = t('entities.dataset', { count: filteredDatasets.length }).toLowerCase();

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
        <Card size="small" className="chart-card">
          <Text className="chart-card__title">{t('catalogue.insights.by_status')}</Text>
          <CategoryDonut
            data={statusData}
            colorsById={STATUS_CHART_COLORS as Record<string, HexColor>}
            selectedIds={sets.status}
            centerLabel={centerLabel}
            formatValue={fmt}
            onClick={handleClick('status')}
          />
        </Card>
        {PCGL_MODE ? (
          <Card size="small" className="chart-card">
            <Text className="chart-card__title">{t('catalogue.insights.by_domain')}</Text>
            <CategoryBarList
              data={domainData.slice(0, 5)}
              colorsById={domainColors}
              selectedIds={sets.domain}
              formatValue={fmt}
              onClick={handleClick('domain')}
            />
          </Card>
        ) : (
          <Card size="small" className="chart-card">
            <Text className="chart-card__title">{t('catalogue.insights.by_project')}</Text>
            <CategoryDonut
              data={projectData}
              colorsById={projectColors as Record<string, HexColor>}
              selectedIds={sets.project}
              centerLabel={centerLabel}
              formatValue={fmt}
              onClick={handleClick('project')}
            />
          </Card>
        )}
        <Card size="small" className="chart-card">
          <Text className="chart-card__title">{t('catalogue.insights.by_keyword')}</Text>
          <CategoryBarList
            data={keywordData.slice(0, 5)}
            colorsById={keywordColors}
            selectedIds={sets.keyword}
            formatValue={fmt}
            onClick={handleClick('keyword')}
          />
        </Card>
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
