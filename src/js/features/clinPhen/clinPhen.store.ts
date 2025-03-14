import type { Individual } from '@/types/clinPhen/individual';
import { RequestStatus } from '@/types/requests';
import { createSlice } from '@reduxjs/toolkit';
import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';

export type ClinPhenState = {
  individualDataStatus: { [key: string]: RequestStatus };
  individualDataCache: { [key: string]: Individual };
};

const initialState: ClinPhenState = {
  individualDataStatus: {},
  individualDataCache: {},
};

const clinPhen = createSlice({
  name: 'clinPhen',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetIndividualData.pending, (state, { meta }) => {
      const id = meta.arg;
      state.individualDataStatus[id] = RequestStatus.Pending;
    });
    builder.addCase(makeGetIndividualData.fulfilled, (state, { payload, meta }) => {
      const id = meta.arg;
      state.individualDataCache[id] = payload;
      state.individualDataStatus[id] = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetIndividualData.rejected, (state, { meta }) => {
      const id = meta.arg;
      state.individualDataStatus[id] = RequestStatus.Rejected;
    });
  },
});

export default clinPhen.reducer;
