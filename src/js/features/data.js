import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { publicOverviewUrl, queryableFieldsUrl } from '../constants';
import { parseData } from '../utils/DataUtils';

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
  reducers: {},
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
      }));

      console.log(fields);
      const all_charts_obj = { ...overview, ...overview.extra_properties };
      delete all_charts_obj.extra_properties;
      delete all_charts_obj.individuals;

      console.log(all_charts_obj);

      const all_charts = Object.entries(all_charts_obj).map((item) => ({
        name: item[0],
        data: item[1],
        isDisplayed: true,
      }));
      console.log(all_charts);

      all_charts.forEach((chart, index, arr) => {
        arr[index].properties = fields.find((e) => e.name == chart.name)?.data;
      });
      console.log(all_charts);
      all_charts.forEach((chart, index, arr) => {
        arr[index].data = parseData(chart);
      });

      state.queryParameterStack = queryParameterStack;
      state.overview = overview;
      state.chartData = all_charts;
      state.individuals = individuals;
      state.isFetchingData = false;
    },
    [makeGetDataRequest.rejected]: (state) => {
      state.isFetchingData = false;
    },
  },
});

export const {} = data.actions;

export default data.reducer;
