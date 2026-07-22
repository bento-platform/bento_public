import { useAppDispatch } from '@/hooks';
import { Card, Flex, Typography } from 'antd';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, type FacetId } from '@/features/catalogue/catalogue.store';
import { useFormatNumber, useTranslationFn } from '@/hooks';
import { BarChartOutlined } from '@ant-design/icons';
import type { DatasetWithProject } from '@/features/catalogue/hooks';
import { getLabel, normaliseStatus, statusTranslationKey } from '@/features/catalogue/hooks';
import { CategoryDonut, CategoryBarList, type HexColor, type CategoricalChartDataItem } from 'bento-charts';
import { PCGL_MODE } from '@/config';
import { STATUS_CHART_COLORS } from './constants';

const { Text } = Typography;

import { assignColors } from '@/features/catalogue/hooks';

function buildCounts(
  datasets: DatasetWithProject[],
  getValue: (d: DatasetWithProject) => string[]
): CategoricalChartDataItem[] {
  const map = new Map<string, number>();
  for (const d of datasets) {
    for (const v of getValue(d)) {
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
  }
  return [...map.entries()].map(([x, y]) => ({ x, y, id: x })).sort((a, b) => b.y - a.y);
}

// buildCounts keeps `id` as the raw facet value (needed for toggleFacetValue/colorsById lookups); this applies
// a display translation to `x` only, so labels shown in the chart/legend are localized without losing that key.
const translateEntries = (
  data: CategoricalChartDataItem[],
  toLabel: (id: string) => string
): CategoricalChartDataItem[] => data.map((d) => ({ ...d, x: toLabel(d.id ?? d.x) }));

interface CatalogueInsightsProps {
  filteredDatasets: DatasetWithProject[];
}

const CatalogueInsights = ({ filteredDatasets }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();
  const dispatch = useAppDispatch();
  const { sets, projectColors } = useCatalogueState();

  const statusData = translateEntries(
    buildCounts(filteredDatasets, ({ dataset }) => [normaliseStatus(dataset.study_status)]),
    (id) => t(statusTranslationKey(id))
  );
  const typeData = translateEntries(
    buildCounts(filteredDatasets, ({ dataset }) => dataset.domain ?? []),
    (id) => t(id)
  );
  const programData = translateEntries(
    buildCounts(filteredDatasets, ({ project }) => [project.title]),
    (id) => t(id)
  );
  const keywordData = translateEntries(
    buildCounts(filteredDatasets, ({ dataset }) => (dataset.keywords ?? []).map(getLabel)),
    (id) => t(id)
  );

  const typeColors = assignColors(typeData.map((d) => d.id ?? d.x)) as Record<string, HexColor>;
  const keywordColors = assignColors(keywordData.slice(0, 5).map((d) => d.id ?? d.x)) as Record<string, HexColor>;

  const handleClick = (facetId: FacetId) => (id: string) => {
    dispatch(toggleFacetValue({ facet: facetId, value: id }));
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
            selectedIds={sets.statuses}
            centerLabel={centerLabel}
            formatValue={fmt}
            onClick={handleClick('statuses')}
          />
        </Card>
        {PCGL_MODE ? (
          <Card size="small" className="chart-card">
            <Text className="chart-card__title">{t('catalogue.insights.by_data_type')}</Text>
            <CategoryBarList
              data={typeData.slice(0, 5)}
              colorsById={typeColors}
              selectedIds={sets.dataTypes}
              formatValue={fmt}
              onClick={handleClick('dataTypes')}
            />
          </Card>
        ) : (
          <Card size="small" className="chart-card">
            <Text className="chart-card__title">{t('catalogue.insights.by_keyword')}</Text>
            <CategoryBarList
              data={keywordData.slice(0, 5)}
              colorsById={keywordColors}
              selectedIds={sets.keywords}
              formatValue={fmt}
              onClick={handleClick('keywords')}
            />
          </Card>
        )}
        <Card size="small" className="chart-card">
          <Text className="chart-card__title">{t('catalogue.insights.by_project')}</Text>
          <CategoryDonut
            data={programData}
            colorsById={projectColors as Record<string, HexColor>}
            selectedIds={sets.projects}
            centerLabel={centerLabel}
            formatValue={fmt}
            onClick={handleClick('projects')}
          />
        </Card>
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
