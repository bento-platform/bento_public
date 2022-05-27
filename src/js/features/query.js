import { katsuUrl } from '../constants';
import { debuglog } from '../utils.js';
import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const makeGetKatsuPublic = createAsyncThunk(
  'query/makeGetKatsuPublic',
  async (_ignore, thunkAPI) => {
    const qpsWithValue = [];
    const checkedParametersStack =
      thunkAPI.getState().query.queryParameterCheckedStack;
    checkedParametersStack.forEach(function (item, index) {
      debuglog(item);
      debuglog(index);

      qpsWithValue.push({
        key: item.key,
        type: item.type,
        is_extra_property_key: item.is_extra_property_key,
        value: item.value,
        rangeMin: item.rangeMin,
        rangeMax: item.rangeMax,
        dateAfter: item.dateAfter,
        dateBefore: item.dateBefore,
      });
    });
    debuglog(qpsWithValue);

    return await axios.post(katsuUrl, qpsWithValue);
  }
);

const initialState = {
  isFetchingData: false,
  queryParameterStack: [],
  queryParameterCheckedStack: [],
  queryResponseData: {},
  queryableFields: [],
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    addQueryableFields: (state, { payload }) => {
      state.queryableFields = payload.filter((e) => e.data.queryable);
    },
    addQueryParameterToCheckedStack: (state, { payload }) => {
      const { item, value, min, max } = payload;

      const newStack = state.queryParameterCheckedStack.concat([
        {
          key: item.key,
          type: item.type,
          title: item.title,
          is_extra_property_key: item.is_extra_property_key,
          value: value,
          rangeMin: min,
          rangeMax: max,
        },
      ]);

      state.queryParameterCheckedStack = newStack;
    },
    updateQueryParameterValueInCheckedStack: (state, { payload }) => {
      const { item, itemValue, min, max, dateAfter, dateBefore } = payload;
      const foundItem = state.queryParameterCheckedStack.find(
        (param) => param.title === item.title
      );

      if (foundItem != undefined) {
        const index = state.queryParameterCheckedStack.indexOf(foundItem);

        state.queryParameterCheckedStack = [
          ...state.queryParameterCheckedStack,
        ].splice(index, 1);

        if (item.type == 'number') {
          state.queryParameterCheckedStack =
            state.queryParameterCheckedStack.concat([
              {
                key: item.key,
                type: item.type,
                title: item.title,
                is_extra_property_key: item.is_extra_property_key,
                rangeMin: min,
                rangeMax: max,
              },
            ]);
        } else if (
          item.type == 'string' &&
          item.format != undefined &&
          item.format == 'date'
        ) {
          state.queryParameterCheckedStack =
            state.queryParameterCheckedStack.concat([
              {
                key: item.key,
                type: item.type,
                title: item.title,
                is_extra_property_key: item.is_extra_property_key,
                dateAfter: dateAfter,
                dateBefore: dateBefore,
              },
            ]);
        } else {
          state.queryParameterCheckedStack =
            state.queryParameterCheckedStack.concat([
              {
                key: item.key,
                type: item.type,
                title: item.title,
                is_extra_property_key: item.is_extra_property_key,
                value: itemValue,
              },
            ]);
        }
      }
    },
    removeQueryParameterFromCheckedStack: (state, { payload }) => {
      const item = payload;
      const foundItem = state.queryParameterCheckedStack.find(
        (param) => param.title === item.title
      );
      if (foundItem != undefined) {
        const index = state.queryParameterCheckedStack.indexOf(foundItem);

        dispatch(
          setContent('REMOVE_QUERY_PARAMETER_FROM_CHECKED_STACK', {
            index: index,
          })
        );

        state.queryParameterCheckedStack = [
          ...state.queryParameterCheckedStack,
        ].splice(index, 1);
      }
    },
  },
  extraReducers: {
    [makeGetKatsuPublic.pending]: (state) => {
      state.isFetchingData = true;
    },
    [makeGetKatsuPublic.fulfilled]: (state, { payload }) => {
      state.queryResponseData = payload.data;

      state.isFetchingData = false;
    },
    [makeGetKatsuPublic.rejected]: (state) => {
      state.isFetchingData = false;
    },
  },
});

export const { addQueryableFields } = query.actions;

export default query.reducer;
