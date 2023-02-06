import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Label } from 'recharts';
import { useTranslation } from 'react-i18next';

import {
  BAR_CHART_FILL,
  CHART_MISSING_FILL,
  TOOL_TIP_STYLE,
  COUNT_STYLE,
  LABEL_STYLE,
} from '../../../constants/overviewConstants';

const ASPECT_RATIO = 1.2;
const MAX_TICK_LABEL_CHARS = 15;
const UNITS_LABEL_OFFSET = -75;
const TICKS_SHOW_ALL_LABELS_BELOW = 11;  // Below this # of X-axis ticks, force-show all labels

// vertical spacing between tick line and tick label
const TICK_MARGIN = 5;

const styles = {
  title: {
    fontStyle: 'italic',
    fontSize: '1.5em',
    textAlign: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const tickFormatter = (tickLabel) => {
  if (tickLabel.length <= MAX_TICK_LABEL_CHARS) {
    return tickLabel;
  }
  return `${tickLabel.substring(0, MAX_TICK_LABEL_CHARS)}...`;
};
const fill = (entry) => (entry.x === 'missing' ? CHART_MISSING_FILL : BAR_CHART_FILL);

const BentoBarChart = ({ title, data, units, height }) => {
  const { t } = useTranslation();

  data = data
    .filter((e) => !(e.x === 'missing'))  // remove "missing" field if zero
    .map((d) => ({ ...d, x: t(d.x) }));  // translate label

  const totalCount = data.reduce((sum, e) => sum + e.y, 0);

  // Regarding XAxis.ticks below:
  //  The weird conditional is added from https://github.com/recharts/recharts/issues/2593#issuecomment-1311678397
  //  Basically, if data is empty, Recharts will default to a domain of [0, "auto"] and our tickFormatter trips up
  //  on formatting a non-string. This hack manually overrides the ticks for the axis and blanks it out.
  //    - David L, 2023-01-03
  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>{title}</div>
      <BarChart width={height * ASPECT_RATIO} height={height} data={data} margin={{ top: 10, bottom: 100, right: 20 }}>
        <XAxis
          dataKey="x"
          height={20}
          angle={-45}
          ticks={data.length ? undefined : [""]}
          tickFormatter={tickFormatter}
          tickMargin={TICK_MARGIN}
          textAnchor="end"
          interval={data.length < TICKS_SHOW_ALL_LABELS_BELOW ? 0 : "preserveStartEnd"}
        >
          <Label value={t(units)} offset={UNITS_LABEL_OFFSET} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value={t('Count')} offset={-10} position="left" angle={270} />
        </YAxis>
        <Tooltip content={<BarTooltip totalCount={totalCount} />} />
        <Bar dataKey="y" isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={t(entry.x)} fill={fill(entry)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

function BarTooltip({ active, payload, totalCount }) {
  const { t } = useTranslation();

  if (!active) {
    return null;
  }

  const name = payload[0]?.payload?.x || '';
  const value = payload[0]?.value || 0;
  const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

  return (
    <div style={TOOL_TIP_STYLE}>
      <p style={LABEL_STYLE}>{t(name)}</p>
      <p style={COUNT_STYLE}>
        {value} ({percentage}%)
      </p>
    </div>
  );
}

export default BentoBarChart;
