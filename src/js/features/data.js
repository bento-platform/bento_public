import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  publicOverviewUrl,
  queryableFieldsUrl,
} from '../constants/configConstants';
import { parseData } from '../utils/dataUtils';

import {
  verifyData,
  saveValue,
  getValue,
  convertSequenceAndDisplayData,
} from '../utils/localStorage';

import { LS_CHARTS_KEY } from '../constants/overviewConstants';

// TODO: convert this to a serialisable function (to check remove middleware)
export const makeGetDataRequest = createAsyncThunk(
  'data/getConfigData',
  async () => {
    const [ov, f] = await Promise.all([
      axios.get(publicOverviewUrl),
      axios.get(queryableFieldsUrl),
    ]);
    return { overview: ov.data.overview, queryParameterStack: f.data };
  }
);

const initialState = {
  fields: {},
  isFetchingData: true,
  overview: {},
  chartData: [],
  individuals: 0,
  queryParameterStack: {},
};

const data = createSlice({
  name: 'data',
  initialState,
  reducers: {
    rearrange: (state, { payload }) => {
      const chartsCopy = [...state.chartData];
      state.chartData = payload.map((e) =>
        chartsCopy.find((i) => e === i.name)
      );
      saveValue(LS_CHARTS_KEY, convertSequenceAndDisplayData(state.chartData));
    },
    disableChart: (state, { payload }) => {
      state.chartData.find((e) => e.name === payload).isDisplayed = false;
      saveValue(LS_CHARTS_KEY, convertSequenceAndDisplayData(state.chartData));
    },
    setDisplayedCharts: (state, { payload }) => {
      state.chartData.forEach((val, ind, arr) => {
        arr[ind].isDisplayed = payload.includes(val.name);
      });
      saveValue(LS_CHARTS_KEY, convertSequenceAndDisplayData(state.chartData));
    },
  },
  extraReducers: {
    [makeGetDataRequest.pending]: (state) => {
      state.isFetchingData = true;
    },
    [makeGetDataRequest.fulfilled]: (state, { payload }) => {
      const overview = payload.overview;
      const queryParameterStack = payload.queryParameterStack;
      const individuals = overview.individuals;

      let fields = {
        ...queryParameterStack,
        ...queryParameterStack.extra_properties,
      };
      delete fields.extra_properties;

      fields = Object.entries(fields).map((item) => ({
        name: item[0],
        data: item[1],
        isExtraProperty: queryParameterStack?.extra_properties.hasOwnProperty(
          item[0]
        ),
      }));

      const all_charts_obj = { ...overview, ...overview.extra_properties };
      delete all_charts_obj.extra_properties;
      delete all_charts_obj.individuals;

      let all_charts = Object.entries(all_charts_obj).map((item) => ({
        name: item[0],
        data: item[1],
        isDisplayed: true,
      }));

      all_charts.forEach((chart, index, arr) => {
        arr[index].properties = fields.find((e) => e.name == chart.name)?.data;
        arr[index].data = parseData(chart);
      });

      state.queryParameterStack = queryParameterStack;
      state.overview = overview;
      state.chartData = all_charts;
      state.individuals = individuals;
      state.isFetchingData = false;
      state.fields = fields;

      let convertedData = convertSequenceAndDisplayData(state.chartData);

      const localValue = getValue(LS_CHARTS_KEY, convertedData, (val) =>
        verifyData(val, convertedData)
      );

      state.chartData = localValue.map((e) => ({
        ...state.chartData.find((v) => v.name === e.name),
        isDisplayed: e.isDisplayed,
      }));

      convertedData = convertSequenceAndDisplayData(state.chartData);

      saveValue(LS_CHARTS_KEY, convertedData);
    },
    [makeGetDataRequest.rejected]: (state) => {
      state.isFetchingData = false;
    },
  },
});

export const { rearrange, disableChart, setDisplayedCharts } = data.actions;

export default data.reducer;
