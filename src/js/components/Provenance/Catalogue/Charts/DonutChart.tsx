import { Card, Typography } from 'antd';
import { useFormatNumber, useTranslationFn } from '@/hooks';
import type { FacetId } from '@/features/catalogue/catalogue.store';
import { statusTranslationKey } from '@/features/catalogue/hooks';
import { COLOR_CHART_FALLBACK, COLOR_DONUT_TRACK } from '../constants';

const { Text } = Typography;

const DEFAULT_COLOR = COLOR_CHART_FALLBACK;
const SIZE = 116,
  R = 46,
  CIRC = 2 * Math.PI * R;

const LABEL_WIDTH = 74;
const LABEL_HEIGHT = 30;

interface DonutChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: Record<string, string>;
  total: number;
  centerLabel: string;
  facetId: FacetId;
  selectedValues: string[];
  onSegmentClick: (facetId: FacetId, value: string) => void;
  maxWidth?: number;
}

const DonutChart = ({
  title,
  data,
  colors,
  total,
  centerLabel,
  facetId,
  selectedValues,
  onSegmentClick,
  maxWidth = SIZE,
}: DonutChartProps) => {
  const t = useTranslationFn();
  const fmt = useFormatNumber();
  if (data.length === 0) return null;

  const segments = data.reduce<{ entry: { name: string; value: number }; len: number; dashOffset: number }[]>(
    (acc, entry) => {
      const len = total ? (entry.value / total) * CIRC : 0;
      const dashOffset = -(acc.length > 0 ? acc[acc.length - 1].dashOffset * -1 + acc[acc.length - 1].len : 0);
      return [...acc, { entry, len, dashOffset }];
    },
    []
  );

  const c = SIZE / 2;

  return (
    <Card size="small" className="chart-card">
      <Text className="chart-card__title">{title}</Text>
      <div className="donut-wrap">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="donut w-full h-auto" style={{ maxWidth }}>
          <circle cx={c} cy={c} r={R} fill="none" stroke={COLOR_DONUT_TRACK} strokeWidth="16" />
          {segments.map(({ entry, len, dashOffset }) => (
            <circle
              key={entry.name}
              cx={c}
              cy={c}
              r={R}
              fill="none"
              stroke={colors[entry.name] ?? DEFAULT_COLOR}
              strokeWidth="16"
              strokeDasharray={`${len} ${CIRC - len}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${c} ${c})`}
              className="cursor-pointer"
              onClick={() => onSegmentClick(facetId, entry.name)}
            >
              <title>
                {entry.name}: {fmt(entry.value)}
              </title>
            </circle>
          ))}
          <text x={c} y={c - 6} className="donut-num">
            {fmt(total)}
          </text>
          <foreignObject x={c - LABEL_WIDTH / 2} y={c + 2} width={LABEL_WIDTH} height={LABEL_HEIGHT}>
            <div className="donut-lbl">{centerLabel}</div>
          </foreignObject>
        </svg>
        <div className="chart-legend">
          {data.map((entry) => {
            const sel = selectedValues.includes(entry.name);
            return (
              <div
                key={entry.name}
                className={`legend-row clk${sel ? ' sel' : ''}`}
                onClick={() => onSegmentClick(facetId, entry.name)}
              >
                <span className="dot" style={{ background: colors[entry.name] ?? DEFAULT_COLOR }} />
                <span className="legend-lbl">
                  {facetId === 'statuses' ? t(statusTranslationKey(entry.name)) : t(entry.name)}
                </span>
                <span className="legend-val">{fmt(entry.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DonutChart;
