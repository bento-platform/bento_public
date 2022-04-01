import React from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Label } from "recharts";

const ASPECT_RATIO = 1.2;
const MAX_TICK_LABEL_CHARS = 15;
const UNITS_LABEL_OFFSET = -60;
const FILL_COLOUR = "#576f9e";
const MISSING_FILL_COLOUR = "#bbbbbb";

// vertical spacing betweeen tick line and tick label
const TICK_MARGIN = 5;

const BentoBarChart = ({ title, data, units, height }) => {
  const titleStyle = {
    fontStyle: "italic",
    fontSize: "1.5em",
    textAlign: "center",
  };

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const tickFormatter = (tickLabel) => {
    if (tickLabel.length <= MAX_TICK_LABEL_CHARS) {
      return tickLabel;
    }
    return tickLabel.substring(0, MAX_TICK_LABEL_CHARS) + "...";
  };

  const fill = (entry) => {
    return entry.x == "missing" ? MISSING_FILL_COLOUR : FILL_COLOUR;
  };

  const totalCount = data.reduce((sum, e) => sum + e.y, 0);
  let longestTickLabelLength = Math.max(...data.map((e) => e.x.toString().length));
  longestTickLabelLength = Math.min(longestTickLabelLength, MAX_TICK_LABEL_CHARS);

  // remove "missing" field if zero
  data = data.filter((e) => !(e.x === "missing" && e.y === 0));

  return (
    <div style={wrapperStyle}>
      <div style={titleStyle}>{title}</div>
      <BarChart
        width={height * ASPECT_RATIO}
        height={height}
        data={data}
        margin={{ top: 10, bottom: 100, right: 20 }}
      >
        <XAxis
          dataKey="x"
          height={20}
          angle={-45}
          tickFormatter={tickFormatter}
          tickMargin={TICK_MARGIN}
          textAnchor="end"
          interval={"preserveStartEnd"}
        >
          <Label value={units} offset={UNITS_LABEL_OFFSET} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Count" offset={-10} position="left" angle={270} />
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

const BarTooltip = ({ active, payload, totalCount }) => {
  if (!active) {
    return null;
  }

  const name = payload[0]?.payload?.x || "";
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
        {value} ({percentage}%)
      </p>
    </div>
  );
};

export default BentoBarChart;
