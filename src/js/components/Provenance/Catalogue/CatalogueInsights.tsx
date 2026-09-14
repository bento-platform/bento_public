import { Card, Flex, Typography } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

import { useCatalogueState, useFacetValueLabel } from '@/features/catalogue/hooks';
import { useCatalogueUrlActions } from '@/features/catalogue/useCatalogueUrlSync';
import { useFormatNumber, useTranslationFn } from '@/hooks';

import type { FacetId } from '@/features/catalogue/catalogue.store';
import type { DatasetFacetOption } from '@/features/catalogue/types';

import { CategoryDonut, CategoryBarList, type HexColor, type CategoricalChartDataItem } from 'bento-charts';

import { PCGL_MODE } from '@/config';
import { STATUS_CHART_COLORS } from './constants';

import { assignColors } from '@/features/catalogue/utils';

interface CatalogueInsightCardProps {
  options: DatasetFacetOption[];
  facet: FacetId;
  kind: 'bar' | 'donut';
  centerLabel?: string;
  colors?: Record<string, HexColor>;
}

const CatalogueInsightCard = ({ options, facet, kind, centerLabel, colors }: CatalogueInsightCardProps) => {
  const t = useTranslationFn();
  const getLabel = useFacetValueLabel();
  const fmt = useFormatNumber();

  const { sets } = useCatalogueState();
  const { toggleFacetValue } = useCatalogueUrlActions();

  // The server already sorts by count desc; `id` keeps the raw facet value (needed for
  // toggleFacetValue/colorsById lookups) while `x` carries the translated display label.
  let data: CategoricalChartDataItem[] = options.map((o) => ({ x: getLabel(facet, o.value), y: o.count, id: o.value }));
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
        <CategoryDonut {...commonProps} centerLabel={centerLabel ?? ''} />
      ) : (
        <CategoryBarList {...commonProps} />
      )}
    </Card>
  );
};

interface CatalogueInsightsProps {
  /** Total datasets matching the current search/filter scope, for the status donut's center label. */
  totalCount: number;
}

const CatalogueInsights = ({ totalCount }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const { projectColors, searchFacets } = useCatalogueState();

  const optionsFor = (facet: FacetId) => searchFacets?.[facet] ?? [];
  const centerLabel = t('entities.dataset', { count: totalCount }).toLowerCase();

  return (
    <div className="catalogue-insights">
      <Flex justify="space-between" align="center" className="mb-3">
        <Flex align="center" gap={6}>
          <PieChartOutlined className="text-secondary" />
          <Text className="catalogue-insights__header-title">{t('catalogue.insights.title')}</Text>
        </Flex>
        <Text className="catalogue-insights__hint">{t('catalogue.insights.hint')}</Text>
      </Flex>
      <Flex gap={12} wrap className="items-stretch">
        <CatalogueInsightCard
          options={optionsFor('status')}
          facet="status"
          kind="donut"
          centerLabel={centerLabel}
          colors={STATUS_CHART_COLORS}
        />
        {PCGL_MODE ? (
          <CatalogueInsightCard options={optionsFor('domain')} facet="domain" kind="bar" />
        ) : (
          <CatalogueInsightCard
            options={optionsFor('project')}
            facet="project"
            kind="donut"
            centerLabel={centerLabel}
            colors={projectColors}
          />
        )}
        <CatalogueInsightCard options={optionsFor('keyword')} facet="keyword" kind="bar" />
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
