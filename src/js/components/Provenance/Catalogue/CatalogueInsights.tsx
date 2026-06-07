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

const { Text } = Typography;

import { assignColors } from '@/features/catalogue/hooks';

const STATUS_COLORS: Record<string, string> = {
  Ongoing: '#52C41A',
  Completed: '#1677FF',
  Unassigned: '#8C8C8C',
};

function buildCounts(datasets: DatasetWithProject[], getValue: (d: DatasetWithProject) => string[]): { name: string; value: number }[] {
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
    <div
      style={{
        background: '#EEF3F7',
        border: '1px solid #E0E9F0',
        borderRadius: 12,
        padding: '14px 16px',
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Flex align="center" gap={6}>
          <BarChartOutlined style={{ color: '#054A74' }} />
          <Text style={{ color: '#054A74', fontWeight: 600, fontSize: 14 }}>{t('Dataset insights')}</Text>
        </Flex>
        <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{t('Select a segment to filter')}</Text>
      </Flex>
      <Flex gap={12} wrap style={{ alignItems: 'stretch' }}>
        <DonutChart
          title="By status"
          data={statusData}
          colors={STATUS_COLORS}
          total={filteredDatasets.length}
          centerLabel="datasets"
          facetId="statuses"
          selectedValues={sets.statuses}
          onSegmentClick={handleClick}
        />
        <BarChart
          title="By data type"
          data={typeData}
          colors={typeColors}
          facetId="dataTypes"
          selectedValues={sets.dataTypes}
          onSegmentClick={handleClick}
        />
        <BarChart
          title="By keyword"
          data={keywordData.slice(0, 5)}
          colors={keywordColors}
          facetId="keywords"
          selectedValues={sets.keywords}
          onSegmentClick={handleClick}
        />
        <DonutChart
          title="By project"
          data={programData}
          colors={projectColors}
          total={filteredDatasets.length}
          centerLabel="datasets"
          facetId="programs"
          selectedValues={sets.programs}
          onSegmentClick={handleClick}
        />
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
