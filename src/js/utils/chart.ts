import type { Datum } from '@/types/discovery';
import type { ChartData } from '@/types/data';

export const serializeChartData = (chartData: Datum[]): ChartData[] => {
  return chartData.map(({ label, value }) => ({ x: label, y: value }));
};

export const noop = () => {};
