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

/**
 * Check wether a given property has the shape of a chart configuration, i.e.
 * an object where every key is associated with a numerical value
 * @param {object} prop
 * @returns
 */
const isChartConfig = (prop) => {
  if (typeof prop !== 'object') return false;
  return Object.values(prop).every((v) => typeof v === 'number');
};

export const makeGetDataRequest = createAsyncThunk(
  'data/getConfigData',
  async (_ignore, thunkAPI) => {
    try {
      const [overview, queryParameterStack] = await Promise.all([
        axios.get(publicOverviewUrl),
        axios.get(queryableFieldsUrl),
      ]).then(([ov, f]) => [ov.data.overview, f.data]);

      // converting fields to usable form
      const { extra_properties, ...everything_else } = queryParameterStack;
      const fieldMap = {
        ...everything_else,
        ...extra_properties,
      };

      let fields = Object.entries(fieldMap).map((item) => ({
        name: item[0],
        data: item[1],
        isExtraProperty: queryParameterStack.extra_properties?.hasOwnProperty(
          item[0]
        ),
      }));

      //updating the query store with the fields to prevent 2 api calls
      thunkAPI.dispatch(addQueryableFields(fields));

      // extracting individuals from overview
      const individuals = overview.individuals;

      // unwinding extra properties to allChartsObj
      const { extra_properties_ovw, ...everything_else_ovw } = overview;
      const allChartsObj = {
        ...extra_properties_ovw,
        ...everything_else_ovw,
      };

      let allCharts = Object.entries(allChartsObj)
        .filter(([_, value]) => isChartConfig(value))
        .map(([name, rawData]) => {
          const properties = fieldMap[name];
          const data = parseData({ data: rawData, properties });
          return {
            name,
            data,
            properties,
            isDisplayed: true,
          };
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
