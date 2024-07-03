import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MAX_CHARTS, katsuPublicOverviewUrl } from '@/constants/configConstants';

import { verifyData, saveValue, getValue, convertSequenceAndDisplayData } from '@/utils/localStorage';

import { DEFAULT_CHART_WIDTH, LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { serializeChartData } from '@/utils/chart';
import { ChartConfig } from '@/types/chartConfig';
import { ChartDataField, LocalStorageData, Sections } from '@/types/data';
import { Counts, OverviewResponse } from '@/types/overviewResponse';
import { printAPIError } from '@/utils/error.util';
import { RootState } from '@/store';

export const makeGetDataRequestThunk = createAsyncThunk<
  { sectionData: Sections; counts: Counts; defaultData: Sections },
  void,
  { rejectValue: string; state: RootState }
>('data/makeGetDataRequest', async (_, { rejectWithValue, getState }) => {
  const overviewResponse = (await axios
    .get(katsuPublicOverviewUrl, { params: getState().metadata.params })
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue))) as OverviewResponse['overview'];

  const sections = overviewResponse.layout;

  // Take chart configuration and create a combined state object with:
  //   the chart configuration
  // + displayed boolean - whether this chart is shown
  // + field definition (from config.field)
  // + the fields' relevant data.
  const normalizeChart = (chart: ChartConfig, i: number): ChartDataField => {
    const { data, ...field } = overviewResponse.fields[chart.field];
    return {
      id: field.id,
      chartConfig: chart,
      field,
      data: serializeChartData(data),
      // Initial display state
      isDisplayed: i < MAX_CHARTS,
      width: chart.width ?? DEFAULT_CHART_WIDTH, // initial configured width; users can change it from here
      isSearchable: false,
    };
  };

  const sectionData: Sections = sections.map(({ section_title, charts }) => ({
    sectionTitle: section_title,
    charts: charts.map(normalizeChart),
  }));

  const defaultSectionData = JSON.parse(JSON.stringify(sectionData));

  // comparing to the local store and updating itself
  let convertedData = convertSequenceAndDisplayData(sectionData);
  const localValue = getValue(LOCALSTORAGE_CHARTS_KEY, convertedData, (val: LocalStorageData) =>
    verifyData(val, convertedData)
  );
  sectionData.forEach(({ sectionTitle, charts }, i, arr) => {
    arr[i].charts = localValue[sectionTitle].map(({ id, isDisplayed, width }) => ({
      ...charts.find((c) => c.id === id)!,
      isDisplayed,
      width,
    }));
  });

  //saving to local storage
  convertedData = convertSequenceAndDisplayData(sectionData);
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertedData);

  return { sectionData, counts: overviewResponse.counts, defaultData: defaultSectionData };
});
