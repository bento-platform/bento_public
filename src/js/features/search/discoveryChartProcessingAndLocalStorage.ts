import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { DiscoveryResponse } from '@/types/discovery/response';
import type { ChartConfig } from '@/types/discovery/chartConfig';
import type { ChartDataField, LocalStorageChartData, Sections } from '@/types/data';

import { MAX_CHARTS } from '@/constants/configConstants';
import { DEFAULT_CHART_WIDTH } from '@/constants/overviewConstants';

import { serializeChartData } from '@/utils/chart';
import {
  convertSequenceAndDisplayData,
  generateLSChartDataKey,
  getValue,
  saveValue,
  verifyData,
} from '@/utils/localStorage';

export const discoveryChartProcessingAndLocalStorage = (
  scope: DiscoveryScope,
  { layout: sections, fields }: DiscoveryResponse
) => {
  // Take chart configuration and create a combined state object with:
  //   the chart configuration
  // + displayed boolean - whether this chart is shown
  // + field definition (from config.field)
  // + the fields' relevant data.
  const normalizeChart = (chart: ChartConfig, i: number): ChartDataField => {
    const { data, definition } = fields[chart.field];
    return {
      id: chart.field,
      chartConfig: chart,
      field: definition,
      data: serializeChartData(data),
      // Initial display state
      isDisplayed: i < MAX_CHARTS,
      width: chart.width ?? DEFAULT_CHART_WIDTH, // initial configured width; users can change it from here
    };
  };

  const sectionData: Sections = sections.map(({ section_title, charts }) => ({
    sectionTitle: section_title,
    // Filter out charts where field data is missing due to missing counts permissions for the field's data type
    charts: charts.filter((c) => !!fields[c.field]).map(normalizeChart),
  }));

  const defaultLayout = JSON.parse(JSON.stringify(sectionData));

  // comparing to the local store and updating itself
  let convertedData = convertSequenceAndDisplayData(sectionData);
  const lsKey = generateLSChartDataKey(scope);
  const localValue = getValue(lsKey, convertedData, (val: LocalStorageChartData) => verifyData(val, convertedData));
  sectionData.forEach(({ sectionTitle, charts }, i, arr) => {
    arr[i].charts = localValue[sectionTitle].map(({ id, isDisplayed, width }) => ({
      ...charts.find((c) => c.id === id)!,
      isDisplayed,
      width,
    }));
  });

  //saving to local storage
  convertedData = convertSequenceAndDisplayData(sectionData);
  saveValue(lsKey, convertedData);

  return { defaultLayout, sectionData };
};
