import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { authorizedRequestConfig } from '@/utils/requests';

// TODO: find a way to allow this without an auth token
export const makeGetDataTypes = createAsyncThunk<
  object,
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>('dataTypes/makeGetDataTypes', async (_, { getState }) => {
  // Not scoped currently - this is a way to get all data types in an instance from service registry, but it may make
  // sense in the future to forward query params to nested calls depending on scope value especially in the case of
  // count handling. TBD - TODO: figure this out
  const res = await axios.get('/api/service-registry/data-types', authorizedRequestConfig(getState()));
  return res.data;
});

export type DataTypesState = {
  isFetching: boolean;
  dataTypes: object;
};

const initialState: DataTypesState = {
  isFetching: false,
  dataTypes: {},
};

const dataTypes = createSlice({
  name: 'dataTypes',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(makeGetDataTypes.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(makeGetDataTypes.fulfilled, (state, { payload }: PayloadAction<object>) => {
      state.isFetching = false;
      state.dataTypes = { ...payload };
    });
    builder.addCase(makeGetDataTypes.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export default dataTypes.reducer;
