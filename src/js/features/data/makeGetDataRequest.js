import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  publicOverviewUrl,
  queryableFieldsUrl,
} from '../../constants/configConstants';
import { parseData } from '../../utils/dataUtils';

import {
  verifyData,
  saveValue,
  getValue,
  convertSequenceAndDisplayData,
} from '../../utils/localStorage';

import { LOCALSTORAGE_CHARTS_KEY } from '../../constants/overviewConstants';
import { addQueryableFields } from '../query';

export const makeGetDataRequest = createAsyncThunk(
  'data/getConfigData',
  async (_ignore, thunkAPI) => {
    try {
      const [overview, queryParameterStack] = await Promise.all([
        axios.get(publicOverviewUrl),
        axios.get(queryableFieldsUrl),
      ]).then(([ov, f]) => [ov.data.overview, f.data]);

      // converting fields to usable form
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

      //updating the query store with the fields to prevent 2 api calls
      thunkAPI.dispatch(addQueryableFields(fields));

      // extracting individuals from overview
      const individuals = overview.individuals;

      // unwinding extra properties to allChartsObj
      const allChartsObj = { ...overview, ...overview.extra_properties };
      delete allChartsObj.extra_properties;

      // removing all non-chart keys
      Object.entries(allChartsObj).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          delete allChartsObj[key];
        } else if (!Object.values(value).every((v) => typeof v === 'number'))
          delete allChartsObj[key];
      });

      let allCharts = Object.entries(allChartsObj).map((item) => ({
        name: item[0],
        data: item[1],
        isDisplayed: true,
      }));
      allCharts.forEach((chart, index, arr) => {
        arr[index].properties = fields.find((e) => e.name === chart.name)?.data;
        arr[index].data = parseData(chart);
      });

      // comparing to the local store and updating itself
      let convertedData = convertSequenceAndDisplayData(allCharts);
      const localValue = getValue(
        LOCALSTORAGE_CHARTS_KEY,
        convertedData,
        (val) => verifyData(val, convertedData)
      );
      allCharts = localValue.map((e) => ({
        ...allCharts.find((v) => v.name === e.name),
        isDisplayed: e.isDisplayed,
      }));

      //saving to local storage
      convertedData = convertSequenceAndDisplayData(allCharts);
      saveValue(LOCALSTORAGE_CHARTS_KEY, convertedData);

      return { individuals, allCharts };
    } catch (error) {
      throw Error(error);
    }
  }
);

export default {
  [makeGetDataRequest.pending]: (state) => {
    state.isFetchingData = true;
  },
  [makeGetDataRequest.fulfilled]: (state, { payload }) => {
    const { allCharts, individuals } = payload;

    state.chartData = allCharts;
    state.individuals = individuals;
    state.isFetchingData = false;
  },
  [makeGetDataRequest.rejected]: (state) => {
    state.isFetchingData = false;
  },
};
