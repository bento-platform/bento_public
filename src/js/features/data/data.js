import { createSlice } from '@reduxjs/toolkit';

import makeGetDataRequestReducers, { makeGetDataRequest } from './makeGetDataRequest';

const initialState = {
  isFetchingData: true,
  sections: [],
  counts: {
    individuals: 0,
    biosamples: 0,
    experiments: 0,
  },
  metadata: [],
};

const data = createSlice({
  name: 'data',
  initialState,
  reducers: {
    rearrange: (state, { payload }) => {
      const { section, arrangement } = payload;
      const sectionObj = state.sections.find((e) => e.sectionTitle === section);
      const chartsCopy = [...sectionObj.charts];
      sectionObj.charts = arrangement.map((e) => chartsCopy.find((i) => e === i.id));
    },
    disableChart: (state, { payload }) => {
      const { section, id } = payload;
      state.sections.find((e) => e.sectionTitle === section).charts.find((e) => e.id === id).isDisplayed = false;
    },
    setDisplayedCharts: (state, { payload }) => {
      const { section, charts } = payload;
      state.sections
        .find((e) => e.sectionTitle === section)
        .charts.forEach((val, ind, arr) => {
          arr[ind].isDisplayed = charts.includes(val.id);
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
