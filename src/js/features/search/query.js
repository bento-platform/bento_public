import { createSlice } from '@reduxjs/toolkit';
import makeGetKatsuPublicReducers, { makeGetKatsuPublic } from './makeGetKatsuPublic';
import makeGetSearchFieldsReducers, { makeGetSearchFields } from './makeGetSearchFields';

const initialState = {
  isFetchingFields: false,
  isFetchingData: false,
  queryResponseData: {},
  querySections: [],
  queryParams: {},
  queryParamCount: 0,
  isValid: false,
  biosampleChartData: [],
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
  },
  extraReducers: {
    ...makeGetKatsuPublicReducers,
    ...makeGetSearchFieldsReducers,
  },
});

export const { addQueryParam, removeQueryParam } = query.actions;
export { makeGetKatsuPublic, makeGetSearchFields };
export default query.reducer;
