import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Label } from 'recharts';
import {
  TOOL_TIP_STYLE,
  COUNT_STYLE,
  LABEL_STYLE,
  CHART_WRAPPER_STYLE,
  MAX_TICK_LABEL_CHARS,
  TITLE_STYLE,
  ASPECT_RATIO,
  TICKS_SHOW_ALL_LABELS_BELOW,
  UNITS_LABEL_OFFSET,
  TICK_MARGIN,
} from './chartConstants';

import { BarChartProps, ChartDataItem, TooltipPayload } from './chartTypes';
import { useChartTheme, useChartTranslation } from './ChartConfigProvider';

const tickFormatter = (tickLabel: string) => {
  if (tickLabel.length <= MAX_TICK_LABEL_CHARS) {
    return tickLabel;
  }
  return `${tickLabel.substring(0, MAX_TICK_LABEL_CHARS)}...`;
};

const BentoBarChart = ({
  data,
  height,
  units,
  title,
  preFilter,
  dataMap,
  postFilter,
  removeEmpty = true,
  colorTheme = 'default',
}: BarChartProps) => {
  const t = useChartTranslation();
  const { fill: chartFill, missing } = useChartTheme().bar[colorTheme];

  const fill = (entry: ChartDataItem) => (entry.x === 'missing' ? missing : chartFill);

  data = [...data];
  if (preFilter) data = data.filter(preFilter);
  if (dataMap) data = data.map(dataMap);
  if (postFilter) data = data.filter(postFilter);

  if (removeEmpty) data = data.filter((d) => d.y !== 0);

  const totalCount = data.reduce((sum, e) => sum + e.y, 0);

  // Regarding XAxis.ticks below:
  //  The weird conditional is added from https://github.com/recharts/recharts/issues/2593#issuecomment-1311678397
  //  Basically, if data is empty, Recharts will default to a domain of [0, "auto"] and our tickFormatter trips up
  //  on formatting a non-string. This hack manually overrides the ticks for the axis and blanks it out.
  //    - David L, 2023-01-03
  return (
    <div style={CHART_WRAPPER_STYLE}>
      <div style={TITLE_STYLE}>{title}</div>
      <BarChart width={height * ASPECT_RATIO} height={height} data={data} margin={{ top: 10, bottom: 100, right: 20 }}>
        <XAxis
          dataKey="x"
          height={20}
          angle={-45}
          ticks={data.length ? undefined : ['']}
          tickFormatter={tickFormatter}
          tickMargin={TICK_MARGIN}
          textAnchor="end"
          interval={data.length < TICKS_SHOW_ALL_LABELS_BELOW ? 0 : 'preserveStartEnd'}
        >
          <Label value={units} offset={UNITS_LABEL_OFFSET} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value={t['Count']} offset={-10} position="left" angle={270} />
        </YAxis>
        <Tooltip content={<BarTooltip totalCount={totalCount} />} />
        <Bar dataKey="y" isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.x} fill={fill(entry)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

const BarTooltip = ({
  active,
  payload,
  totalCount,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  totalCount: number;
}) => {
  if (!active) {
    return null;
  }

  const name = (payload && payload[0]?.payload?.x) || '';
  const value = (payload && payload[0]?.value) || 0;
  const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

  return (
    <div style={TOOL_TIP_STYLE}>
      <p style={LABEL_STYLE}>{name}</p>
      <p style={COUNT_STYLE}>
        {value} ({percentage}%)
      </p>
    </div>
  );
};

export default BentoBarChart;
