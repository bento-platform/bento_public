import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';
import { Sections } from '@/types/data';
import { Counts } from '@/types/overviewResponse';

interface DataState {
  isFetchingData: boolean;
  sections: Sections;
  counts: Counts;
}

const initialState: DataState = {
  isFetchingData: true,
  sections: [],
  counts: {
    individuals: 0,
    biosamples: 0,
    experiments: 0,
  },
};

const data = createSlice({
  name: 'data',
  initialState,
  reducers: {
    rearrange: (state, { payload }: PayloadAction<{ section: string; arrangement: string[] }>) => {
      const { section, arrangement } = payload;
      const sectionObj = state.sections.find((e) => e.sectionTitle === section)!;
      const chartsCopy = [...sectionObj.charts];
      sectionObj.charts = arrangement.map((e) => chartsCopy.find((i) => e === i.id)!);
    },
    disableChart: (state, { payload }: PayloadAction<{ section: string; id: string }>) => {
      const { section, id } = payload;
      state.sections.find((e) => e.sectionTitle === section)!.charts.find((e) => e.id === id)!.isDisplayed = false;
    },
    setDisplayedCharts: (state, { payload }) => {
      const { section, charts } = payload;
      state.sections
        .find((e) => e.sectionTitle === section)!
        .charts.forEach((val, ind, arr) => {
          arr[ind].isDisplayed = charts.includes(val.id);
        });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeGetDataRequestThunk.pending, (state) => {
        state.isFetchingData = true;
      })
      .addCase(makeGetDataRequestThunk.fulfilled, (state, { payload }) => {
        state.sections = payload.sectionData;
        state.counts = payload.counts;
        state.isFetchingData = false;
      })
      .addCase(makeGetDataRequestThunk.rejected, (state) => {
        state.isFetchingData = false;
      });
  },
});

export const { rearrange, disableChart, setDisplayedCharts } = data.actions;
export { makeGetDataRequestThunk };
export default data.reducer;
