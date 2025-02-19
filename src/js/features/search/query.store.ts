import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_DISCOVERY_RESULTS } from '@/constants/searchConstants';
import type { DiscoveryResults } from '@/types/data';
import type { KatsuSearchResponse, SearchFieldResponse } from '@/types/search';
import { serializeChartData } from '@/utils/chart';

import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';

export type QueryState = {
  isFetchingFields: boolean;
  attemptedFieldsFetch: boolean;
  isFetchingData: boolean;
  attemptedFetch: boolean;
  querySections: SearchFieldResponse['sections'];
  queryParams: { [key: string]: string };
  queryParamCount: number;
  message: string;
  results: DiscoveryResults;
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
  results: EMPTY_DISCOVERY_RESULTS,
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
      state.results = {
        // biosamples
        biosampleCount: payload.biosamples.count,
        biosampleChartData: serializeChartData(payload.biosamples.sampled_tissue),
        // experiments
        experimentCount: payload.experiments.count,
        experimentChartData: serializeChartData(payload.experiments.experiment_type),
        // individuals
        individualCount: payload.count,
        individualMatches: payload.matches, // Undefined if no permissions
      };
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
