import type { Individual } from '@/types/clinPhen/individual';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { RequestStatus } from '@/types/requests';
import { createSlice } from '@reduxjs/toolkit';
import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';

export type ClinPhenState = {
  individualDataStatus: { [key: string]: RequestStatus };
  individualDataCache: { [key: string]: Individual };
  phenopacketDataStatus: { [key: string]: RequestStatus };
  phenopacketDataCache: { [key: string]: Phenopacket };
};

const initialState: ClinPhenState = {
  individualDataStatus: {},
  individualDataCache: {},
  phenopacketDataStatus: {},
  phenopacketDataCache: {},
};

const clinPhen = createSlice({
  name: 'clinPhen',
  initialState,
  reducers: {
    clearIndividualCache: (state) => {
      state.individualDataStatus = {};
      state.individualDataCache = {};
    },
    clearPhenopacketCache: (state) => {
      state.phenopacketDataStatus = {};
      state.phenopacketDataCache = {};
    },
  },
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
    builder.addCase(makeGetPhenopacketData.pending, (state, { meta }) => {
      const id = meta.arg;
      state.phenopacketDataStatus[id] = RequestStatus.Pending;
    });
    builder.addCase(makeGetPhenopacketData.fulfilled, (state, { payload, meta }) => {
      const id = meta.arg;
      state.phenopacketDataCache[id] = payload;
      state.phenopacketDataStatus[id] = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetPhenopacketData.rejected, (state, { meta }) => {
      const id = meta.arg;
      state.phenopacketDataStatus[id] = RequestStatus.Rejected;
    });
  },
});

export const { clearIndividualCache, clearPhenopacketCache } = clinPhen.actions;
export default clinPhen.reducer;
