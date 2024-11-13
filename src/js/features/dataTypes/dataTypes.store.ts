import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { BentoServiceDataType } from '@/types/dataTypes';
import { RequestStatus } from '@/types/requests';
import { authorizedRequestConfig } from '@/utils/requests';

export const makeGetDataTypes = createAsyncThunk<
  BentoServiceDataType[],
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'dataTypes/makeGetDataTypes',
  async (_, { getState }) => {
    // Not scoped currently - this is a way to get all data types in an instance from service registry, but it may make
    // sense in the future to forward query params to nested calls depending on scope value especially in the case of
    // count handling. TBD - TODO: figure this out
    const res = await axios.get('/api/service-registry/data-types', authorizedRequestConfig(getState()));
    return res.data;
  },
  {
    condition(_, { getState }) {
      const { status } = getState().dataTypes;
      const cond = status === RequestStatus.Idle;
      if (!cond) console.debug(`makeGetDataTypes() was attempted, but a prior attempt gave status: ${status}`);
      return cond;
    },
  }
);

export type DataTypesState = {
  status: RequestStatus;
  dataTypesById: Record<string, BentoServiceDataType>;
};

const initialState: DataTypesState = {
  status: RequestStatus.Idle,
  dataTypesById: {},
};

const dataTypes = createSlice({
  name: 'dataTypes',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(makeGetDataTypes.pending, (state) => {
      state.status = RequestStatus.Pending;
    });
    builder.addCase(makeGetDataTypes.fulfilled, (state, { payload }) => {
      state.status = RequestStatus.Fulfilled;
      state.dataTypesById = Object.fromEntries(payload.map((dt) => [dt.id, dt]));
    });
    builder.addCase(makeGetDataTypes.rejected, (state) => {
      state.status = RequestStatus.Rejected;
    });
  },
});

export default dataTypes.reducer;
