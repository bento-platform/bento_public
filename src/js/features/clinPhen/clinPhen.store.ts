import type { Biosample } from '@/types/clinPhen/biosample';
import type { Individual } from '@/types/clinPhen/individual';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { RequestStatus } from '@/types/requests';
import { createSlice } from '@reduxjs/toolkit';
import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { makeGetBiosampleData } from '@/features/clinPhen/makeGetBiosampleData.thunk';

export type ClinPhenState = {
  individualDataStatus: { [key: string]: RequestStatus };
  individualDataCache: { [key: string]: Individual };
  phenopacketDataStatus: { [key: string]: RequestStatus };
  phenopacketDataCache: { [key: string]: Phenopacket };
  biosampleDataStatus: { [key: string]: RequestStatus };
  biosampleDataCache: { [key: string]: Biosample };
};

const initialState: ClinPhenState = {
  individualDataStatus: {},
  individualDataCache: {},
  phenopacketDataStatus: {},
  phenopacketDataCache: {},
  biosampleDataStatus: {},
  biosampleDataCache: {},
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
    clearBiosampleCache: (state) => {
      state.biosampleDataStatus = {};
      state.biosampleDataCache = {};
    },
  },
  extraReducers: (builder) => {
    // Individuals
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
    // Phenopackets
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
    // Biosamples
    builder.addCase(makeGetBiosampleData.pending, (state, { meta }) => {
      const id = meta.arg;
      state.biosampleDataStatus[id] = RequestStatus.Pending;
    });
    builder.addCase(makeGetBiosampleData.fulfilled, (state, { payload, meta }) => {
      const id = meta.arg;
      state.biosampleDataCache[id] = payload;
      state.biosampleDataStatus[id] = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetBiosampleData.rejected, (state, { meta }) => {
      const id = meta.arg;
      state.biosampleDataStatus[id] = RequestStatus.Rejected;
    });
  },
});

export const { clearIndividualCache, clearPhenopacketCache, clearBiosampleCache } = clinPhen.actions;
export default clinPhen.reducer;
