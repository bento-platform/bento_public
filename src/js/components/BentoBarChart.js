import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Label } from "recharts";

const ASPECT_RATIO = 1.2;

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
    return null;
  };

  const totalCount = data.reduce((sum, e) => sum + e.y, 0);

  return (
    <div style={wrapperStyle}>
      <div style={titleStyle}>{title}</div>
      <BarChart
        width={height * ASPECT_RATIO}
        height={height}
        data={data}
        // margin={{ top: 50, right: 80, bottom: 30, left: 80 }}
        margin={{ bottom: 50 }}
      >
        <XAxis dataKey="x" height={20} angle={-45} dy={15}>
          <Label value={units} offset={-40} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Count" offset={-10} position="left" angle={270} />
        </YAxis>
        <Tooltip content={<BarTooltip totalCount={totalCount} />} />
        <Bar dataKey="y" fill="#ff0000" isAnimationActive={false} />
      </BarChart>
    </div>
  );
};

const BarTooltip = ({ active, payload, totalCount }) => {
  if (!active) {
    return null;
  }


  console.log({active:active, payload:payload, totalCount:totalCount})


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
