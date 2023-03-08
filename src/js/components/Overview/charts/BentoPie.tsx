// TODO: Add comments telling how can you translate
// TODO: Add a way for default translation
// TODO: Add default inputs
// TODO: Add theme selection for chart
// TODO: Add comment on how to remove missing

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Curve, Tooltip, Sector } from 'recharts';
import { Props } from 'recharts/types/polar/Pie';
type PieProps = Props;
import CSS from 'csstype';

import {
  TOOL_TIP_STYLE,
  LABEL_STYLE,
  COUNT_STYLE,
  OTHER_THRESHOLD,
  CHART_MISSING_FILL,
  CHART_WRAPPER_STYLE,
  RADIAN,
  MAX_LABEL_CHARS,
  CHART_ASPECT_RATIO,
  LABEL_THRESHOLD,
  COUNT_TEXT_STYLE,
  TEXT_STYLE,
} from './chartConstants';
import { PieChartProps, TooltipPayload } from './chartTypes';
import { useChartTheme, useChartTranslation } from './ChartConfigProvider';
import { polarToCartesian } from './chartUtils';

const labelShortName = (name: string) => {
  if (name.length <= MAX_LABEL_CHARS) {
    return name;
  }
  // removing 3 character cause ... s add three characters
  return `${name.substring(0, MAX_LABEL_CHARS - 3)}\u2026`;
};

const BentoPie = ({
  data,
  height,
  preFilter,
  dataMap,
  postFilter,
  sort = true,
  removeEmpty = true,
  colorTheme = 'default',
}: PieChartProps) => {
  const t = useChartTranslation();
  const theme = useChartTheme().pie[colorTheme];

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // ##################### Data processing #####################

  data = [...data]; // Changing immutable data to mutable data
  if (preFilter) data = data.filter(preFilter);
  if (dataMap) data = data.map(dataMap);
  if (postFilter) data = data.filter(postFilter);

  // removing empty values
  if (removeEmpty) data = data.filter((e) => e.y !== 0);

  if (sort) data.sort((a, b) => a.y - b.y);

  // combining sections with less than OTHER_THRESHOLD
  const sum = data.reduce((acc, e) => acc + e.y, 0);
  const length = data.length;
  const threshold = OTHER_THRESHOLD * sum;
  const temp = data.filter((e) => e.y > threshold);
  // length - 1 intentional: if there is just one category bellow threshold the "Other" category is not necessary
  data = temp.length === length - 1 ? data : temp;
  if (data.length !== length) {
    data.push({ x: t['Other'], y: sum - data.reduce((acc, e) => acc + e.y, 0) });
  }

  const bentoFormatData = data.map((e) => ({ name: e.x, value: e.y }));

  // ##################### Rendering #####################
  const onEnter: PieProps['onMouseEnter'] = (_data, index) => {
    setActiveIndex(index);
  };

  const onHover: PieProps['onMouseOver'] = (_data, _index, e) => {
    const { target } = e;
    if (target) (target as SVGElement).style.cursor = 'pointer';
  };

  const onLeave: PieProps['onMouseLeave'] = () => {
    setActiveIndex(undefined);
  };

  return (
    <div style={CHART_WRAPPER_STYLE}>
      <PieChart height={height} width={height * CHART_ASPECT_RATIO}>
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
            let fill = theme[index % theme.length];
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
};

const renderLabel: PieProps['label'] = (params) => {
  const { cx, cy, midAngle, outerRadius, fill, payload, index, activeIndex } = params;

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

  const currentTextStyle: CSS.Properties = {
    ...TEXT_STYLE,
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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} style={COUNT_TEXT_STYLE}>
        {`(${payload.value})`}
      </text>
    </g>
  );
};

const renderActiveLabel: PieProps['activeShape'] = (params) => {
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

const CustomTooltip = ({
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

  const name = payload ? payload[0].name : '';
  const value = payload ? payload[0].value : 0;
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
};

export default BentoPie;
