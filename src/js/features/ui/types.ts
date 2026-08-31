export type ChartSizeMode = 'compact' | 'normal';

// Shape of UI settings object to be persisted to/hydrated from local storage
export type UIUserSettings = {
  overviewChartMode: ChartSizeMode;
};
