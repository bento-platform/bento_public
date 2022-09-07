import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MAX_CHARTS, publicOverviewUrl } from '../../constants/configConstants';

import { verifyData, saveValue, getValue, convertSequenceAndDisplayData } from '../../utils/localStorage';

import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';

export const makeGetDataRequest = createAsyncThunk('data/makeGetDataRequest', async () => {
  try {
    const overviewResponse = await axios.get(publicOverviewUrl).then((res) => res.data.overview);
    const sections = overviewResponse.layout;
    const normalizeChart = (chart, i) => ({
      chartType: chart.chart_type,
      isDisplayed: i < MAX_CHARTS,
      name: chart.field,
      ...overviewResponse.fields[chart.field],
      data: overviewResponse.fields[chart.field].data.map(({ label, value }) => ({
        x: label,
        y: value,
      })),
    });

    const sectionData = sections.map(({ section_title, charts }) => ({
      sectionTitle: section_title,
      charts: charts.map(normalizeChart),
    }));

    // comparing to the local store and updating itself
    let convertedData = convertSequenceAndDisplayData(sectionData);
    const localValue = getValue(LOCALSTORAGE_CHARTS_KEY, convertedData, (val) => verifyData(val, convertedData));
    sectionData.forEach(({ sectionTitle, charts }, i, arr) => {
      arr[i].charts = localValue[sectionTitle].map(({ id, isDisplayed }) => ({
        ...charts.find((c) => c.id === id),
        isDisplayed,
      }));
    });

    //saving to local storage
    convertedData = convertSequenceAndDisplayData(sectionData);
    saveValue(LOCALSTORAGE_CHARTS_KEY, convertedData);

    return { sectionData, individuals: overviewResponse.counts.individuals };
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
});

export default {
  [makeGetDataRequest.pending]: (state) => {
    state.isFetchingData = true;
  },
  [makeGetDataRequest.fulfilled]: (state, { payload }) => {
    state.sections = payload.sectionData;
    state.individuals = payload.individuals;
    state.isFetchingData = false;
  },
  [makeGetDataRequest.rejected]: (state) => {
    state.isFetchingData = false;
  },
};
