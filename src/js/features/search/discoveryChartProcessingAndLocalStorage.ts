import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { DiscoveryFieldResponses, DiscoveryResponse } from '@/types/discovery/response';
import type { ChartConfig, ChartLayoutSection } from '@/types/discovery/chartConfig';
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

const _asSlug = (x: string): string => x.normalize('NFKD').toLowerCase().trim().replace(/\s+/g, '-');

export const discoveryChartProcessingAndLocalStorage = (
  scope: DiscoveryScope,
  { layout: sections, fields }: DiscoveryResponse,
  scopeFieldData?: DiscoveryFieldResponses
) => {
  // Take chart configuration and create a combined state object with:
  //   the chart configuration
  // + displayed boolean - whether this chart is shown
  // + field definition (from config.field)
  // + the fields' relevant data.
  const normalizeChart = (
    chart: ChartConfig,
    i: number,
    defaultCharts: ChartLayoutSection['default_charts']
  ): ChartDataField => {
    const { data, definition } = fields[chart.field];
    const dataContext = scopeFieldData?.[chart.field]?.data;
    const initialIsDisplayed =
      defaultCharts === null
        ? i < MAX_CHARTS
        : typeof defaultCharts === 'number'
          ? i < defaultCharts
          : defaultCharts.includes(chart.field);
    return {
      id: chart.field,
      chartConfig: chart,
      field: definition,
      data: serializeChartData(data),
      dataContext: dataContext ? serializeChartData(dataContext) : undefined,
      // Initial display state
      isDisplayed: initialIsDisplayed,
      width: chart.width ?? DEFAULT_CHART_WIDTH, // initial configured width; users can change it from here
    };
  };

  const sectionData: Sections = sections.map(({ section_title, charts, default_charts }, idx) => ({
    sectionId: `sec-${idx}-${_asSlug(section_title)}`,
    sectionTitle: section_title,
    // Filter out charts where field data is missing due to low cell counts _or_ missing counts permissions for the
    // field's data type
    charts: charts
      .filter((c) => !!(scopeFieldData ?? fields)[c.field])
      .map((chart, i) => normalizeChart(chart, i, default_charts)),
  }));

  const defaultLayout = JSON.parse(JSON.stringify(sectionData));

  // comparing to the local store and updating itself
  let convertedData = convertSequenceAndDisplayData(sectionData);
  const lsKey = generateLSChartDataKey(scope);
  const localValue = getValue(lsKey, convertedData, (val: LocalStorageChartData) => verifyData(val, convertedData));
  sectionData.forEach(({ sectionId, charts }, i, arr) => {
    arr[i].charts = localValue[sectionId].map(({ id, isDisplayed, width }) => ({
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
