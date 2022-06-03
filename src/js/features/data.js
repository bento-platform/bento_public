import { createSlice } from '@reduxjs/toolkit';

import {
  saveValue,
  convertSequenceAndDisplayData,
} from '../utils/localStorage';

import makeGetDataRequestReducers, {
  makeGetDataRequest,
} from './data/makeGetDataRequest';
import { LS_CHARTS_KEY } from '../constants/overviewConstants';

const initialState = {
  isFetchingData: true,
  chartData: [],
  individuals: 0,
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
    ...makeGetDataRequestReducers,
  },
});

export const { rearrange, disableChart, setDisplayedCharts } = data.actions;
export { makeGetDataRequest };
export default data.reducer;
