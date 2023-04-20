import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MAX_CHARTS, publicOverviewUrl } from '@/constants/configConstants';

import { verifyData, saveValue, getValue, convertSequenceAndDisplayData } from '@/utils/localStorage';

import { LOCALSTORAGE_CHARTS_KEY } from '@/constants/overviewConstants';
import { serializeChartData } from '@/utils/chart';
import { LocalStorageData, Sections } from '@/types/data';
import { Chart, Counts, OverviewResponse } from '@/types/overviewResponse';
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
  const normalizeChart = (chart: Chart, i: number) => ({
    chartType: chart.chart_type,
    isDisplayed: i < MAX_CHARTS,
    name: chart.field,
    ...overviewResponse.fields[chart.field],
    data: serializeChartData(overviewResponse.fields[chart.field].data),
  });

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