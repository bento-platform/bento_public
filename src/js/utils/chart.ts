import type { Datum } from '@/types/discovery';
import type { ChartData } from '@/types/data';

export const serializeChartData = (chartData: Datum[]): ChartData[] => {
  return chartData.map(({ label, value }) => ({ x: label, y: value }));
};

export const noop = () => {};

export const getChartCssWidth = (nColumns: number, gridGap: number) => {
  const cssWidthWithoutGaps = `(var(--content-max-width) - (${gridGap}px * ${nColumns - 1}))`;
  return `(${cssWidthWithoutGaps} / ${nColumns})`;
};
