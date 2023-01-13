import React, { useState } from 'react';
import { PieChart, Pie, Cell, Curve, Tooltip, Sector } from 'recharts';
import { polarToCartesian } from 'recharts/es6/util/PolarUtils';

import {
  COLORS,
  TOOL_TIP_STYLE,
  LABEL_STYLE,
  COUNT_STYLE,
  OTHER_THRESHOLD,
  CHART_MISSING_FILL,
} from '../../../constants/overviewConstants';
import { useTranslation } from 'react-i18next';

const RADIAN = Math.PI / 180;
const chartAspectRatio = 1.4;
const LABEL_THRESHOLD = 0.05;
const MAX_LABEL_CHARS = 14;

const textStyle = {
  fontSize: '11px',
  fill: '#333',
};
const countTextStyle = {
  fontSize: '10px',
  fill: '#999',
};

const labelShortName = (name) => {
  if (name.length <= MAX_LABEL_CHARS) {
    return name;
  }
  // removing 3 character cause ... s add three characters
  return `${name.substring(0, MAX_LABEL_CHARS - 3)}\u2026`;
};

function BentoPie({ data, height, sort }) {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(undefined);

  data = [...data] // Changing immutable data to mutable data
    .filter((e) => !(e.x === 'missing'))
    .map((d) => ({ ...d, x: t(d.x) })); // Translating the labels

  if (sort) data.sort((a, b) => a.y - b.y);

  // combining sections with less than OTHER_THRESHOLD
  const sum = data.reduce((acc, e) => acc + e.y, 0);
  const length = data.length;
  const threshold = OTHER_THRESHOLD * sum;
  const temp = data.filter((e) => e.y > threshold);
  // length - 1 intentional: if there is just one category bellow threshold the "Other" category is not necessary
  data = temp.length === length - 1 ? data : temp;
  if (data.length !== length) {
    data.push({ x: 'Other', y: sum - data.reduce((acc, e) => acc + e.y, 0) });
  }

  const bentoFormatData = data.map((e) => ({ name: e.x, value: e.y }));

  const onEnter = (_data, index) => {
    setActiveIndex(index);
  };

  const onHover = (_data, _index, e) => {
    e.target.style.cursor = 'pointer';
  };

  const onLeave = () => {
    setActiveIndex(undefined);
  };

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const renderLabel = (params, activeIndex) => {
    const { cx, cy, midAngle, outerRadius, fill, payload, index } = params;

    // skip rendering this static label if the sector is selected.
    // this will let the 'renderActiveState' draw without overlapping.
    // also, skip rendering if segment is too small a percentage (avoids label clutter)
    if (index === activeIndex || params.percent < LABEL_THRESHOLD) {
      return;
    }

    const name = payload.name === 'null' ? '(Empty)' : payload.name;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    const currentTextStyle = {
      ...textStyle,
      fontWeight: payload.selected ? 'bold' : 'normal',
      fontStyle: payload.name === 'null' ? 'italic' : 'normal',
    };

    const offsetRadius = 20;
    const startPoint = polarToCartesian(params.cx, params.cy, params.outerRadius, midAngle);
    const endPoint = polarToCartesian(params.cx, params.cy, params.outerRadius + offsetRadius, midAngle);
    const lineProps = {
      ...params,
      fill: 'none',
      stroke: fill,
      points: [startPoint, endPoint],
    };

    return (
      <g>
        <Curve {...lineProps} type="linear" className="recharts-pie-label-line" />

        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 3} textAnchor={textAnchor} style={currentTextStyle}>
          {labelShortName(name)}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} style={countTextStyle}>
          {`(${t(payload.value)})`}
        </text>
      </g>
    );
  };

  const renderActiveLabel = (params) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = params;

    // render arc around active segment
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  function CustomTooltip({ active, payload, totalCount }) {
    if (!active) {
      return null;
    }

    const name = payload[0]?.name || '';
    const value = payload[0]?.value || 0;
    const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

    return (
      <div style={TOOL_TIP_STYLE}>
        <p style={LABEL_STYLE}>{name}</p>
        <p style={COUNT_STYLE}>
          {' '}
          {value} ({percentage}
          %)
        </p>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <PieChart height={height} width={height * chartAspectRatio}>
        <Pie
          data={bentoFormatData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={80}
          label={renderLabel}
          labelLine={false}
          isAnimationActive={false}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseOver={onHover}
          activeIndex={activeIndex}
          activeShape={renderActiveLabel}
        >
          {data.map((entry, index) => {
            let fill = COLORS[index % COLORS.length];
            fill = entry.x.toLowerCase() === 'missing' ? CHART_MISSING_FILL : fill;
            return <Cell key={index} fill={fill} />;
          })}
        </Pie>
        <Tooltip
          content={<CustomTooltip totalCount={sum} />}
          isAnimationActive={false}
          allowEscapeViewBox={{ x: true, y: true }}
        />
      </PieChart>
    </div>
  );
}

export default BentoPie;
