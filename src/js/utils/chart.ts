import { Datum } from '@/types/overviewResponse';

export const serializeChartData = (chartData: Datum[]) => {
  return chartData.map(({ label, value }) => ({ x: label, y: value }));
};
