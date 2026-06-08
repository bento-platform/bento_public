import { useAppDispatch } from '@/hooks';
import { Flex, Typography } from 'antd';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, type FacetId } from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';
import { BarChartOutlined } from '@ant-design/icons';
import type { DatasetWithProject } from '@/features/catalogue/hooks';
import { getLabel, normaliseStatus } from '@/features/catalogue/hooks';
import DonutChart from './Charts/DonutChart';
import BarChart from './Charts/BarChart';
import { PCGL_MODE } from '@/config';
import { STATUS_CHART_COLORS } from './constants';

const { Text } = Typography;

import { assignColors } from '@/features/catalogue/hooks';

function buildCounts(
  datasets: DatasetWithProject[],
  getValue: (d: DatasetWithProject) => string[]
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const d of datasets) {
    for (const v of getValue(d)) {
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

interface CatalogueInsightsProps {
  filteredDatasets: DatasetWithProject[];
}

const CatalogueInsights = ({ filteredDatasets }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { sets, projectColors } = useCatalogueState();

  const statusData = buildCounts(filteredDatasets, ({ dataset }) => [normaliseStatus(dataset.study_status)]);
  const typeData = buildCounts(filteredDatasets, ({ dataset }) => dataset.domain ?? []);
  const programData = buildCounts(filteredDatasets, ({ project }) => [project.title]);
  const keywordData = buildCounts(filteredDatasets, ({ dataset }) => (dataset.keywords ?? []).map(getLabel));

  const typeColors = assignColors(typeData.map((d) => d.name));
  const keywordColors = assignColors(keywordData.slice(0, 5).map((d) => d.name));

  const handleClick = (facetId: FacetId, value: string) => {
    dispatch(toggleFacetValue({ facet: facetId, value }));
  };

  return (
    <div className="catalogue-insights">
      <Flex justify="space-between" align="center" className="mb-3">
        <Flex align="center" gap={6}>
          <BarChartOutlined className="text-cat-primary" />
          <Text className="catalogue-insights__header-title">{t('Dataset insights')}</Text>
        </Flex>
        <Text className="catalogue-insights__hint">{t('Select a segment to filter')}</Text>
      </Flex>
      <Flex gap={12} wrap className="items-stretch">
        <DonutChart
          title="By status"
          data={statusData}
          colors={STATUS_CHART_COLORS}
          total={filteredDatasets.length}
          centerLabel="datasets"
          facetId="statuses"
          selectedValues={sets.statuses}
          onSegmentClick={handleClick}
        />
        {PCGL_MODE ? (
          <BarChart
            title="By data type"
            data={typeData.slice(0, 5)}
            colors={typeColors}
            facetId="dataTypes"
            selectedValues={sets.dataTypes}
            onSegmentClick={handleClick}
          />
        ) : (
          <BarChart
            title="By keyword"
            data={keywordData.slice(0, 5)}
            colors={keywordColors}
            facetId="keywords"
            selectedValues={sets.keywords}
            onSegmentClick={handleClick}
          />
        )}
        <DonutChart
          title="By project"
          data={programData}
          colors={projectColors}
          total={filteredDatasets.length}
          centerLabel="datasets"
          facetId="projects"
          selectedValues={sets.projects}
          onSegmentClick={handleClick}
        />
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
