import { useAppDispatch } from '@/hooks';
import { Card, Flex, Typography } from 'antd';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useCatalogueState } from '@/features/catalogue/hooks';
import { toggleFacetValue, type FacetId } from '@/features/catalogue/catalogue.store';
import { useTranslationFn } from '@/hooks';
import { BarChartOutlined } from '@ant-design/icons';
import type { DatasetWithProject } from '@/features/catalogue/hooks';

const { Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
  ONGOING: '#52C41A',
  COMPLETED: '#1677FF',
  DRAFT: '#FAAD14',
};

const TYPE_COLORS: Record<string, string> = {
  Clinical: '#1677FF',
  Genomic: '#13C2C2',
  Biosample: '#722ED1',
  Questionnaire: '#FA8C16',
  Imaging: '#52C41A',
};

const PROGRAM_COLORS: Record<string, string> = {
  MOHCCN: '#1677FF',
  CPHI: '#13C2C2',
};

const DEFAULT_COLOR = '#8C8C8C';

function buildCounts(datasets: DatasetWithProject[], getValue: (d: DatasetWithProject) => string[]): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const d of datasets) {
    for (const v of getValue(d)) {
      if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
  }
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

interface DonutChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: Record<string, string>;
  facetId: FacetId;
  selectedValues: string[];
  onSegmentClick: (facetId: FacetId, value: string) => void;
}

const DonutChart = ({ title, data, colors, facetId, selectedValues, onSegmentClick }: DonutChartProps) => {
  const t = useTranslationFn();
  if (data.length === 0) return null;

  return (
    <Card size="small" style={{ flex: 1, minWidth: 180 }}>
      <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>{t(title)}</Text>
      <Flex gap={8} align="center" wrap>
        <RechartsPieChart width={110} height={110}>
          <Pie
            data={data}
            cx={50}
            cy={50}
            innerRadius={30}
            outerRadius={50}
            dataKey="value"
            paddingAngle={1}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={colors[entry.name] ?? DEFAULT_COLOR}
                stroke={selectedValues.includes(entry.name) ? '#fff' : 'transparent'}
                strokeWidth={selectedValues.includes(entry.name) ? 2 : 0}
                opacity={selectedValues.length > 0 && !selectedValues.includes(entry.name) ? 0.45 : 1}
                style={{ cursor: 'pointer' }}
                onClick={() => onSegmentClick(facetId, entry.name)}
              />
            ))}
          </Pie>
          <Tooltip formatter={(val, name) => [val, t(name as string)]} />
        </RechartsPieChart>
        <Flex vertical gap={4} style={{ flex: 1 }}>
          {data.map((entry) => {
            const sel = selectedValues.includes(entry.name);
            return (
              <div
                key={entry.name}
                onClick={() => onSegmentClick(facetId, entry.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  opacity: selectedValues.length > 0 && !sel ? 0.5 : 1,
                  fontWeight: sel ? 600 : 'normal',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: colors[entry.name] ?? DEFAULT_COLOR,
                    flexShrink: 0,
                  }}
                />
                <Text style={{ fontSize: 12, flex: 1 }}>{t(entry.name)}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{entry.value}</Text>
              </div>
            );
          })}
        </Flex>
      </Flex>
    </Card>
  );
};

interface HBarChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: Record<string, string>;
  facetId: FacetId;
  selectedValues: string[];
  onSegmentClick: (facetId: FacetId, value: string) => void;
}

const HBarChart = ({ title, data, colors, facetId, selectedValues, onSegmentClick }: HBarChartProps) => {
  const t = useTranslationFn();
  if (data.length === 0) return null;

  return (
    <Card size="small" style={{ flex: 1, minWidth: 180 }}>
      <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>{t(title)}</Text>
      <ResponsiveContainer width="100%" height={Math.max(80, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} tickFormatter={(v) => t(v)} />
          <Tooltip formatter={(val, name) => [val, t(name as string)]} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} onClick={(entry) => entry.name && onSegmentClick(facetId, entry.name)}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={colors[entry.name] ?? DEFAULT_COLOR}
                opacity={selectedValues.length > 0 && !selectedValues.includes(entry.name) ? 0.45 : 1}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

interface CatalogueInsightsProps {
  filteredDatasets: DatasetWithProject[];
}

const CatalogueInsights = ({ filteredDatasets }: CatalogueInsightsProps) => {
  const t = useTranslationFn();
  const dispatch = useAppDispatch();
  const { sets } = useCatalogueState();

  const statusData = buildCounts(filteredDatasets, ({ dataset }) => (dataset.study_status ? [dataset.study_status] : []));
  const typeData = buildCounts(filteredDatasets, ({ dataset }) => dataset.domain ?? []);
  const programData = buildCounts(filteredDatasets, ({ dataset }) => (dataset.program_name ? [dataset.program_name] : []));

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
          facetId="statuses"
          selectedValues={sets.statuses}
          onSegmentClick={handleClick}
        />
        <HBarChart
          title="By data type"
          data={typeData}
          colors={TYPE_COLORS}
          facetId="dataTypes"
          selectedValues={sets.dataTypes}
          onSegmentClick={handleClick}
        />
        <DonutChart
          title="By program"
          data={programData}
          colors={PROGRAM_COLORS}
          facetId="programs"
          selectedValues={sets.programs}
          onSegmentClick={handleClick}
        />
      </Flex>
    </div>
  );
};

export default CatalogueInsights;
