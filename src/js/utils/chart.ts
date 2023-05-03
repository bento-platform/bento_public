import { Datum } from '@/types/overviewResponse';
import { ChartData } from '@/types/data';

export const serializeChartData = (chartData: Datum[]): ChartData[] => {
  return chartData.map(({ label, value }) => ({ x: label, y: value }));
};
