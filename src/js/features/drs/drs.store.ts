import { createSlice } from '@reduxjs/toolkit';
import type { DrsRecord } from './types';
import { RequestStatus } from '@/types/requests';
import { getDrsRecord } from './getDrsRecord.thunk';

export type DrsRecordState = {
  record: DrsRecord | null;
  status: RequestStatus;
  error: string | null;
};

export type DrsState = {
  byUri: Record<string, DrsRecordState>;
};

const initialState: DrsState = {
  byUri: {},
};

const drs = createSlice({
  name: 'drs',
  initialState,
  reducers: {
    clearDrsCache: (state) => {
      state.byUri = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDrsRecord.pending, (state, { meta }) => {
      if (!state.byUri[meta.arg]) {
        state.byUri[meta.arg] = { record: null, status: RequestStatus.Pending, error: null };
      } else {
        state.byUri[meta.arg].status = RequestStatus.Pending;
      }
    });
    builder.addCase(getDrsRecord.fulfilled, (state, { meta, payload }) => {
      state.byUri[meta.arg] = { record: payload, status: RequestStatus.Fulfilled, error: null };
    });
    builder.addCase(getDrsRecord.rejected, (state, { meta, payload }) => {
      state.byUri[meta.arg].status = RequestStatus.Rejected;
      state.byUri[meta.arg].error =
        typeof payload === 'object' ? ((payload as { msg?: string })?.msg ?? 'Unknown Error') : 'Invalid Response';
    });
  },
});

export default drs.reducer;
