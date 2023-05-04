import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { makeGetKatsuPublic } from './makeGetKatsuPublic.thunk';
import { makeGetSearchFields } from './makeGetSearchFields.thunk';
import { serializeChartData } from '@/utils/chart';
import { KatsuSearchResponse, SearchFieldResponse } from '@/types/search';
import { ChartData } from '@/types/data';

type queryState = {
  isFetchingFields: boolean;
  isFetchingData: boolean;
  queryResponseData: KatsuSearchResponse;
  querySections: SearchFieldResponse['sections'];
  queryParams: { [key: string]: string };
  queryParamCount: number;
  isValid: boolean;
  biosampleCount: number;
  biosampleChartData: ChartData[];
  experimentCount: number;
  experimentChartData: ChartData[];
};

const initialState: queryState = {
  isFetchingFields: false,
  isFetchingData: false,
  queryResponseData: {
    status: '',
    message: '',
    biosamples: {
      count: 0,
      sampled_tissue: [],
    },
    count: 0,
    experiments: {
      count: 0,
      experiment_type: [],
    },
  },
  querySections: [],
  queryParams: {},
  queryParamCount: 0,
  isValid: false,
  biosampleCount: 0,
  biosampleChartData: [],
  experimentCount: 0,
  experimentChartData: [],
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    addQueryParam: (state, { payload }) => {
      if (!(payload.id in state.queryParams)) state.queryParamCount++;
      state.queryParams[payload.id] = payload.value;
      state.isValid = false;
    },
    removeQueryParam: (state, { payload: id }) => {
      if (id in state.queryParams) {
        delete state.queryParams[id];
        state.queryParamCount--;
      }
      state.isValid = false;
    },
    setQueryParams: (state, { payload }) => {
      state.queryParams = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeGetKatsuPublic.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(makeGetKatsuPublic.fulfilled, (state, { payload }: PayloadAction<KatsuSearchResponse>) => {
      state.queryResponseData = payload;
      state.isFetchingData = false;
      state.isValid = true;
      state.biosampleCount = payload.biosamples.count;
      state.biosampleChartData = serializeChartData(payload.biosamples.sampled_tissue);
      state.experimentCount = payload.experiments.count;
      state.experimentChartData = serializeChartData(payload.experiments.experiment_type);
    });
    builder.addCase(makeGetKatsuPublic.rejected, (state) => {
      state.isFetchingData = false;
    });
    builder.addCase(makeGetSearchFields.pending, (state) => {
      state.isFetchingFields = true;
    });
    builder.addCase(makeGetSearchFields.fulfilled, (state, { payload }) => {
      state.querySections = payload.sections;
      state.isFetchingFields = false;
    });
    builder.addCase(makeGetSearchFields.rejected, (state) => {
      state.isFetchingFields = false;
    });
  },
});

export const { addQueryParam, removeQueryParam, setQueryParams } = query.actions;
export { makeGetKatsuPublic, makeGetSearchFields };
export default query.reducer;
