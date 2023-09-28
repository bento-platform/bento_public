import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MAX_CHARTS, publicOverviewUrl } from '@/constants/configConstants';

import { verifyData, saveValue, getValue, convertSequenceAndDisplayData } from '@/utils/localStorage';

import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { serializeChartData } from '@/utils/chart';
import { ChartConfig } from '@/types/chartConfig';
import { ChartDataField, LocalStorageData, Sections } from '@/types/data';
import { Counts, OverviewResponse } from '@/types/overviewResponse';
import { printAPIError } from '@/utils/error.util';

export const makeGetDataRequestThunk = createAsyncThunk<
  { sectionData: Sections; counts: Counts },
  void,
  { rejectValue: string }
>('data/makeGetDataRequest', async (_, { rejectWithValue }) => {
  const overviewResponse = (await axios
    .get(publicOverviewUrl)
    .then((res) => res.data.overview)
    .catch(printAPIError(rejectWithValue))) as OverviewResponse['overview'];

  const sections = overviewResponse.layout;

  // Take chart configuration and create a combined state object with:
  //   the chart configuration
  // + displayed boolean - whether this chart is shown
  // + field definition (from config.field)
  // + the fields' relevant data.
  const normalizeChart = (chart: ChartConfig, i: number): ChartDataField => {
    const field = overviewResponse.fields[chart.field];
    return {
      id: field.id,
      chartTypeConfig: chart,
      isDisplayed: i < MAX_CHARTS,
      field,
      data: serializeChartData(field.data),
    };
  };

  const sectionData: Sections = sections.map(({ section_title, charts }) => ({
    sectionTitle: section_title,
    charts: charts.map(normalizeChart),
  }));

  // comparing to the local store and updating itself
  let convertedData = convertSequenceAndDisplayData(sectionData);
  const localValue = getValue(LOCALSTORAGE_CHARTS_KEY, convertedData, (val: LocalStorageData) =>
    verifyData(val, convertedData)
  );
  sectionData.forEach(({ sectionTitle, charts }, i, arr) => {
    arr[i].charts = localValue[sectionTitle].map(({ id, isDisplayed }) => ({
      ...charts.find((c) => c.id === id)!,
      isDisplayed,
    }));
  });

  //saving to local storage
  convertedData = convertSequenceAndDisplayData(sectionData);
  saveValue(LOCALSTORAGE_CHARTS_KEY, convertedData);

  return { sectionData, counts: overviewResponse.counts };
});
