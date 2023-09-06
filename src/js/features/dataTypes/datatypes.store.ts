import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// TODO: find a way to allow this without an auth token
export const makeGetDataTypes = createAsyncThunk('datatypes/makeGetDataTypes', async () => {
  const res = await axios.get('/api/service-registry/data-types');
  const data = res.data;
  return data;
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
    builder.addCase(makeGetDataTypes.fulfilled, (state, { payload }: PayloadAction<{ en: string; fr: string }>) => {
      state.isFetching = false;
      state.dataTypes = { ...payload };
    });
    builder.addCase(makeGetDataTypes.rejected, (state) => {
        state.isFetching = false;
    })
  },
});

export default dataTypes.reducer;
