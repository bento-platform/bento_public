import { katsuUrl } from '../constants/configConstants';
import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { determineQueryType, getRelatedFields } from '../utils/queryUtils';

export const makeGetKatsuPublic = createAsyncThunk(
  'query/makeGetKatsuPublic',
  async (_ignore, thunkAPI) => {
    const fieldData = thunkAPI.getState().query.queryableFields;
    const findInData = (key) => fieldData.find((e) => e.name === key);

    const queryParams = thunkAPI.getState().query.queryParams;

    const queryParamsModified = queryParams.map((e) => ({
      key: e.name,
      type: findInData(e.name)?.data.type,
      is_extra_property_key: findInData(e.name)?.isExtraProperty,
      ...getRelatedFields(e.queryType, e.params),
    }));

    return await axios
      .post(katsuUrl, queryParamsModified)
      .then((res) => res.data);
  }
);

const initialState = {
  isFetchingData: false,
  queryResponseData: { status: 'initial' },
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
      const element = state.queryParams.find((e) => e.name === payload.name);

      if (element) {
        element.params = payload.params;
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
  },
  extraReducers: {
    [makeGetKatsuPublic.pending]: (state) => {
      state.isFetchingData = true;
    },
    [makeGetKatsuPublic.fulfilled]: (state, { payload }) => {
      if (payload.hasOwnProperty('message'))
        state.queryResponseData = {
          status: 'message',
          message: payload.message,
        };
      else state.queryResponseData = { status: 'count', count: payload.count };

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
