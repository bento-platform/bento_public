import { createSlice } from '@reduxjs/toolkit';
import { debuglog } from './utils';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    config: {},
    isFetchingConfig: false,
    overview: {},
    isFetchingOverview: false,
    isFetchingFields: false,
    queryParameterStack: [],
    queryParameterCheckedStack: [],
    queryResponseData: {},
    isFetchingData: false,
  },
  reducers: {
    SET_FETCHING_DATA: (state, action) => {
      state.isFetchingData = action.content.fetch;
    },
    SET_FETCHING_CONFIG: (state, action) => {
      state.isFetchingConfig = action.content.fetch;
    },
    SET_FETCHING_OVERVIEW: (state, action) => {
      state.isFetchingOverview = action.content.fetch;
    },
    SET_FETCHING_FIELDS: (state, action) => {
      state.isFetchingFields = action.content.fetch;
    },
    SET_CONFIG: (state, action) => {
      state.config = action.content.config;
      state.isFetchingConfig = false;
    },
    SET_OVERVIEW: (state, action) => {
      (state.overview = action.content.overview),
        (state.isFetchingOverview = false);
    },
    SET_QUERY_RESPONSE_DATA: (state, action) => {
      (state.queryResponseData = action.content.queryResponseData),
        (state.isFetchingData = false);
    },
    SET_QUERY_PARAMETER_STACK: (state, action) => {
      debuglog('Reducing SET_QUERY_PARAMETER_STACK');

      debuglog('Current stack: ' + state.queryParameterStack);
      const newStack = action.content.items;
      debuglog('New stack: ' + newStack);

      state.queryParameterStack = newStack;
      state.isFetchingFields = false;
    },
    ADD_QUERY_PARAMETER_TO_CHECKED_STACK: (state, action) => {
      debuglog('Reducing ADD_QUERY_PARAMETER_TO_CHECKED_STACK');

      debuglog('Current stack: ' + state.queryParameterCheckedStack);
      const newStack = state.queryParameterCheckedStack.concat([
        action.content.queryParameter,
      ]);
      debuglog('New stack: ' + newStack);
      state.queryParameterCheckedStack = newStack;
    },
    REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK: (state, action) => {
      debuglog('Reducing REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK');

      debuglog('Current stack: ' + state.queryParameterCheckedStack);
      const newStack = [...state.queryParameterCheckedStack];
      newStack.splice(action.content.index, 1);
      debuglog('New stack: ' + newStack);

      state.queryParameterCheckedStack = newStack;
    },
  },
});

export default dataSlice.reducer;
