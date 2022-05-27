import { katsuUrl } from '../constants';
import { debuglog } from '../utils.js';
import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { determineQueryType } from '../utils/queryUtils';

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
  queryParams: [],
  queryParamCount: 0,
};

const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    addQueryableFields: (state, { payload }) => {
      state.queryableFields = payload
        .filter((e) => e.data.queryable)
        .map((e) => ({ ...e, queryType: determineQueryType(e.data) }));
    },
    addQueryParam: (state, { payload }) => {
      if (state.queryParams.map((e) => e.name).includes(payload.name)) {
        state.queryParams.find((e) => e.name === payload.name).params =
          payload.params;
      } else {
        state.queryParams.push(payload);
        state.queryParamCount++;
      }
    },
    removeQueryParam: (state, { payload }) => {
      state.queryParams = state.queryParams.filter((e) => {
        if (e.name !== payload) return true;
        else {
          state.queryParamCount--;
          return false;
        }
      });
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

export const { addQueryableFields, addQueryParam, removeQueryParam } =
  query.actions;

export default query.reducer;
