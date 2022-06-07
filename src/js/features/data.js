import { createSlice } from '@reduxjs/toolkit';

import makeGetDataRequestReducers, {
  makeGetDataRequest,
} from './data/makeGetDataRequest';

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
    },
    disableChart: (state, { payload }) => {
      state.chartData.find((e) => e.name === payload).isDisplayed = false;
    },
    setDisplayedCharts: (state, { payload }) => {
      state.chartData.forEach((val, ind, arr) => {
        arr[ind].isDisplayed = payload.includes(val.name);
      });
    },
  },
  extraReducers: {
    ...makeGetDataRequestReducers,
  },
});

export const { rearrange, disableChart, setDisplayedCharts } = data.actions;
export { makeGetDataRequest };
export default data.reducer;
