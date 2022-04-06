import React, { useState } from "react";
import { PieChart, Pie, Cell, Curve, Tooltip, Sector } from "recharts";
import { polarToCartesian } from "recharts/es6/util/PolarUtils";

import { COLORS } from "../constants";

const RADIAN = Math.PI / 180;
const chartAspectRatio = 1.4;
const LABEL_THRESHOLD = 0.05;
const MAX_LABEL_CHARS = 14;

const textStyle = {
  fontSize: "11px",
  fill: "#333",
};
const countTextStyle = {
  fontSize: "10px",
  fill: "#999",
};

const titleStyle = {
  fontStyle: "italic",
  fontSize: "1.5em",
  marginBottom: "-15px",
  textAlign: "center",
};

const labelShortName = (name) => {
  if (name.length <= MAX_LABEL_CHARS) {
    return name;
  }
  return name.substring(0, MAX_LABEL_CHARS) + "...";
};

const titleHeaderHeight = 31;

const BentoPie = ({ title, data, height }) => {
  console.log({ height: height });

  const [activeIndex, setActiveIndex] = useState(undefined);

  data = data.filter((e) => e.y !== 0);
  const bentoFormatData = data.map((e) => ({ name: e.x, value: e.y }));
  const totalCount = bentoFormatData.reduce((sum, e) => sum + e.value, 0);

  const onEnter = (_data, index) => {
    setActiveIndex(index);
  };

  const onHover = (_data, _index, e) => {
    e.target.style.cursor = "pointer";
  };

  const onLeave = () => {
    setActiveIndex(undefined);
  };

  const onClick = (data) => {
    console.log("click");
  };

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const renderLabel = (params, activeIndex) => {
    const { cx, cy, midAngle, outerRadius, fill, payload, index } = params;

    // skip rendering this static label if the sector is selected.
    // this will let the 'renderActiveState' draw without overlapping.
    // also, skip rendering if segment is too small a percentage (avoids label clutter)
    if (index === activeIndex || params.percent < LABEL_THRESHOLD) {
      return;
    }

    const name = payload.name === "null" ? "(Empty)" : payload.name;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    const currentTextStyle = {
      ...textStyle,
      fontWeight: payload.selected ? "bold" : "normal",
      fontStyle: payload.name === "null" ? "italic" : "normal",
    };

    const offsetRadius = 20;
    const startPoint = polarToCartesian(params.cx, params.cy, params.outerRadius, midAngle);
    const endPoint = polarToCartesian(params.cx, params.cy, params.outerRadius + offsetRadius, midAngle);
    const lineProps = {
      ...params,
      fill: "none",
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
          {`(${payload.value})`}
        </text>
      </g>
    );
  };

  const renderActiveLabel = (params) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = params;

    const name = payload.name === "null" ? "(Empty)" : payload.name;
    const offsetRadius = 20;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + offsetRadius) * cos;
    const my = cy + (outerRadius + offsetRadius) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    const currentTextStyle = {
      ...textStyle,
      fontWeight: "bold",
      fontStyle: payload.name === "null" ? "italic" : "normal",
    };

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

  const CustomTooltip = ({ active, payload, totalCount }) => {
    if (!active) {
      return null;
    }

    const name = payload[0]?.name || "";
    const value = payload[0]?.value || 0;
    const percentage = totalCount ? Math.round((value / totalCount) * 100) : 0;

    const toolTipStyle = {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      padding: "5px",
      border: "1px solid grey",
      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.9)",
      borderRadius: "2px",
      textAlign: "left",
    };

    const labelStyle = {
      fontWeight: "bold",
      fontSize: "12px",
      padding: "0",
      margin: "0",
    };

    const countStyle = {
      fontWeight: "normal",
      fontSize: "11px",
      padding: "0",
      margin: "0",
    };

    return (
      <div style={toolTipStyle}>
        <p style={labelStyle}>{name}</p>
        <p style={countStyle}>
          {" "}
          {value} ({percentage}%)
        </p>
      </div>
    );
  };

  return (
    <div style={wrapperStyle}>
      <div style={titleStyle}>{title}</div>
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
          onClick={onClick}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseOver={onHover}
          activeIndex={activeIndex}
          activeShape={renderActiveLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip totalCount={totalCount} />}
          isAnimationActive={false}
          allowEscapeViewBox={{ x: true, y: true }}
        />
      </PieChart>
    </div>
  );
};

export default BentoPie;
