export const serializeChartData = (chartData) => {
  return chartData.map(({ label, value }) => ({ x: label, y: value }));
};
