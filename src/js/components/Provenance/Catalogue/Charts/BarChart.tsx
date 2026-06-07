import { Card, Typography } from 'antd';
import { useTranslationFn } from '@/hooks';
import type { FacetId } from '@/features/catalogue/catalogue.store';
import { COLOR_BAR_DEFAULT } from '../constants';

const { Text } = Typography;

const DEFAULT_COLOR = COLOR_BAR_DEFAULT;
const fmt = (n: number) => n.toLocaleString('en-US');

interface BarChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: Record<string, string>;
  defaultColor?: string;
  facetId: FacetId;
  selectedValues: string[];
  onSegmentClick: (facetId: FacetId, value: string) => void;
}

const BarChart = ({
  title,
  data,
  colors,
  defaultColor = DEFAULT_COLOR,
  facetId,
  selectedValues,
  onSegmentClick,
}: BarChartProps) => {
  const t = useTranslationFn();
  if (data.length === 0) return null;

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Card size="small" style={{ flex: 1, minWidth: 180 }}>
      <Text className="chart-card__title">{t(title)}</Text>
      <div className="bars">
        {data.map((entry) => {
          const sel = selectedValues.includes(entry.name);
          return (
            <div
              key={entry.name}
              className={`bar-row clk${sel ? ' sel' : ''}`}
              onClick={() => onSegmentClick(facetId, entry.name)}
            >
              <span className="bar-label" title={entry.name}>
                {t(entry.name)}
              </span>
              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{ width: `${(entry.value / max) * 100}%`, background: colors[entry.name] ?? defaultColor }}
                />
              </span>
              <span className="bar-value">{fmt(entry.value)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BarChart;
