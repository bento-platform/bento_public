import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';
import type { Sections } from '@/types/data';
import type { Counts } from '@/types/overviewResponse';
import { RequestStatus } from '@/types/requests';

interface DataState {
  status: RequestStatus;
  defaultLayout: Sections;
  sections: Sections;
  counts: Counts;
}

const initialState: DataState = {
  status: RequestStatus.Idle,
  defaultLayout: [],
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
    rearrange: (state, { payload }: PayloadAction<{ section: number; arrangement: string[] }>) => {
      const { section, arrangement } = payload;
      const sectionObj = state.sections[section]!;
      const chartsCopy = [...sectionObj.charts];
      sectionObj.charts = arrangement.map((e) => chartsCopy.find((i) => e === i.id)!);
    },
    disableChart: (state, { payload }: PayloadAction<{ section: number; id: string }>) => {
      const { section, id } = payload;
      state.sections[section]!.charts.find((e) => e.id === id)!.isDisplayed = false;
    },
    setDisplayedCharts: (state, { payload }: PayloadAction<{ section: number; charts: string[] }>) => {
      const { section, charts } = payload;
      state.sections[section]!.charts.forEach((val, ind, arr) => {
        arr[ind].isDisplayed = charts.includes(val.id);
      });
    },
    setChartWidth: (state, { payload }: PayloadAction<{ section: number; chart: string; width: number }>) => {
      const { section, chart, width } = payload;
      const chartObj = state.sections[section]!.charts.find((c) => c.id === chart)!;
      chartObj.width = width;
    },
    setAllDisplayedCharts: (state, { payload: { section } }: PayloadAction<{ section?: number }>) => {
      if (section) {
        state.sections[section]!.charts.forEach((_, ind, arr) => {
          arr[ind].isDisplayed = true;
        });
      } else {
        state.sections.forEach((section) => {
          section.charts.forEach((_, ind, arr) => {
            arr[ind].isDisplayed = true;
          });
        });
      }
    },
    hideAllSectionCharts: (state, { payload: { section } }: PayloadAction<{ section: number }>) => {
      state.sections[section]!.charts.forEach((_, ind, arr) => {
        arr[ind].isDisplayed = false;
      });
    },
    resetLayout: (state) => {
      state.sections = state.defaultLayout;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeGetDataRequestThunk.pending, (state) => {
        state.status = RequestStatus.Pending;
      })
      .addCase(makeGetDataRequestThunk.fulfilled, (state, { payload }) => {
        state.sections = payload.sectionData;
        state.defaultLayout = payload.defaultData;
        state.counts = payload.counts;
        state.status = RequestStatus.Fulfilled;
      })
      .addCase(makeGetDataRequestThunk.rejected, (state) => {
        state.status = RequestStatus.Rejected;
      });
  },
});

export const {
  rearrange,
  disableChart,
  setDisplayedCharts,
  setChartWidth,
  setAllDisplayedCharts,
  hideAllSectionCharts,
  resetLayout,
} = data.actions;
export { makeGetDataRequestThunk };
export default data.reducer;
