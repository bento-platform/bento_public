import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { makeGetDataRequestThunk } from './makeGetDataRequest.thunk';
import type { Sections } from '@/types/data';
import type { CountsOrBooleans } from '@/types/discovery/response';
import { RequestStatus } from '@/types/requests';

interface DataState {
  status: RequestStatus;
  isInvalid: boolean;
  defaultLayout: Sections;
  sections: Sections;
  counts: CountsOrBooleans;
}

const initialState: DataState = {
  status: RequestStatus.Idle,
  isInvalid: false,
  defaultLayout: [],
  sections: [],
  counts: {
    phenopacket: 0,
    individual: 0,
    biosample: 0,
    experiment: 0,
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
    setDisplayedCharts: (state, { payload }: PayloadAction<{ section: string; charts: string[] }>) => {
      const { section, charts } = payload;
      state.sections
        .find((e) => e.sectionTitle === section)!
        .charts.forEach((val, ind, arr) => {
          arr[ind].isDisplayed = charts.includes(val.id);
        });
    },
    setChartWidth: (state, { payload }: PayloadAction<{ section: string; chart: string; width: number }>) => {
      const { section, chart, width } = payload;
      const chartObj = state.sections.find((e) => e.sectionTitle === section)!.charts.find((c) => c.id === chart)!;
      chartObj.width = width;
    },
    setAllDisplayedCharts: (state, { payload }: PayloadAction<{ section?: string }>) => {
      if (payload.section) {
        state.sections
          .find((e) => e.sectionTitle === payload.section)!
          .charts.forEach((_, ind, arr) => {
            arr[ind].isDisplayed = true;
          });
      } else {
        state.sections.forEach((section) => {
          section.charts.forEach((val, ind, arr) => {
            arr[ind].isDisplayed = true;
          });
        });
      }
    },
    hideAllSectionCharts: (state, { payload }: PayloadAction<{ section: string }>) => {
      state.sections
        .find((e) => e.sectionTitle === payload.section)!
        .charts.forEach((_, ind, arr) => {
          arr[ind].isDisplayed = false;
        });
    },
    resetLayout: (state) => {
      state.sections = state.defaultLayout;
    },
    invalidateData: (state) => {
      state.isInvalid = true;
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
        state.isInvalid = false;
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
  invalidateData,
} = data.actions;
export { makeGetDataRequestThunk };
export default data.reducer;
