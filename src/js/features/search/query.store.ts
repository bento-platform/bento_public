import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { serializeChartData } from '@/utils/chart';
import type { KatsuSearchResponse, SearchFieldResponse } from '@/types/search';
import type { ChartData } from '@/types/data';

export type QueryState = {
  isFetchingFields: boolean;
  attemptedFieldsFetch: boolean;
  isFetchingData: boolean;
  attemptedFetch: boolean;
  querySections: SearchFieldResponse['sections'];
  queryParams: { [key: string]: string };
  queryParamCount: number;
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
  message: string;
  individualCount: number;
  individualMatches?: string[];
};

const initialState: QueryState = {
  isFetchingFields: false,
  attemptedFieldsFetch: false,
  isFetchingData: false,
  attemptedFetch: false,
  message: '',
  querySections: [],
  queryParams: {},
  queryParamCount: 0,
  biosampleCount: 0,
  biosampleChartData: [],
  experimentCount: 0,
  experimentChartData: [],
  individualCount: 0,
  individualMatches: undefined,
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryParams: (state, { payload }) => {
      state.queryParams = payload;
      state.queryParamCount = Object.keys(payload).length;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetKatsuPublic.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(makeGetKatsuPublic.fulfilled, (state, { payload }: PayloadAction<KatsuSearchResponse>) => {
      state.isFetchingData = false;
      state.attemptedFetch = true;
      if (payload && 'message' in payload) {
        state.message = payload.message;
        return;
      }
      state.message = '';
      state.biosampleCount = payload.biosamples.count;
      state.biosampleChartData = serializeChartData(payload.biosamples.sampled_tissue);
      state.experimentCount = payload.experiments.count;
      state.experimentChartData = serializeChartData(payload.experiments.experiment_type);
      state.individualCount = payload.count;
      state.individualMatches = payload.matches; // Undefined if no permissions
    });
    builder.addCase(makeGetKatsuPublic.rejected, (state) => {
      state.isFetchingData = false;
      state.attemptedFetch = true;
    });
    builder.addCase(makeGetSearchFields.pending, (state) => {
      state.isFetchingFields = true;
    });
    builder.addCase(makeGetSearchFields.fulfilled, (state, { payload }) => {
      state.querySections = payload.sections;
      state.isFetchingFields = false;
      state.attemptedFieldsFetch = true;
    });
    builder.addCase(makeGetSearchFields.rejected, (state) => {
      state.isFetchingFields = false;
      state.attemptedFieldsFetch = true;
    });
  },
});

export const { setQueryParams } = query.actions;
export { makeGetKatsuPublic, makeGetSearchFields };
export default query.reducer;
