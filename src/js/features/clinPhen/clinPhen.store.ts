import type { Biosample } from '@/types/clinPhen/biosample';
import type { Individual } from '@/types/clinPhen/individual';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { RequestStatus } from '@/types/requests';
import { createSlice } from '@reduxjs/toolkit';
import { makeGetIndividualData } from '@/features/clinPhen/makeGetIndividualData.thunk';
import { makeGetPhenopacketData } from '@/features/clinPhen/makeGetPhenopacket.thunk';
import { makeGetBiosampleData } from '@/features/clinPhen/makeGetBiosampleData.thunk';
import { makeGetExperimentData } from '@/features/clinPhen/makeGetExperimentData.thunk';
import { makeGetExperimentResultData } from '@/features/clinPhen/makeGetExperimentResultData.thunk';

export type ClinPhenState = {
  individualDataStatus: { [key: string]: RequestStatus };
  individualDataCache: { [key: string]: Individual };
  phenopacketDataStatus: { [key: string]: RequestStatus };
  phenopacketDataCache: { [key: string]: Phenopacket };
  biosampleDataStatus: { [key: string]: RequestStatus };
  biosampleDataCache: { [key: string]: Biosample };
  experimentDataStatus: { [key: string]: RequestStatus };
  experimentDataCache: { [key: string]: Experiment };
  experimentResultDataStatus: { [key: string]: RequestStatus };
  experimentResultDataCache: { [key: string]: ExperimentResult };
};

const initialState: ClinPhenState = {
  individualDataStatus: {},
  individualDataCache: {},
  phenopacketDataStatus: {},
  phenopacketDataCache: {},
  biosampleDataStatus: {},
  biosampleDataCache: {},
  experimentDataStatus: {},
  experimentDataCache: {},
  experimentResultDataStatus: {},
  experimentResultDataCache: {},
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
    clearExperimentCache: (state) => {
      state.experimentDataStatus = {};
      state.experimentDataCache = {};
    },
    clearExperimentResultCache: (state) => {
      state.experimentResultDataStatus = {};
      state.experimentResultDataCache = {};
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
    // Experiments
    builder.addCase(makeGetExperimentData.pending, (state, { meta }) => {
      const id = meta.arg;
      state.experimentDataStatus[id] = RequestStatus.Pending;
    });
    builder.addCase(makeGetExperimentData.fulfilled, (state, { payload, meta }) => {
      const id = meta.arg;
      state.experimentDataCache[id] = payload;
      state.experimentDataStatus[id] = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetExperimentData.rejected, (state, { meta }) => {
      const id = meta.arg;
      state.experimentDataStatus[id] = RequestStatus.Rejected;
    });
    // Experiment Results
    builder.addCase(makeGetExperimentResultData.pending, (state, { meta }) => {
      const id = meta.arg;
      state.experimentResultDataStatus[id] = RequestStatus.Pending;
    });
    builder.addCase(makeGetExperimentResultData.fulfilled, (state, { payload, meta }) => {
      const id = meta.arg;
      state.experimentResultDataCache[id] = payload;
      state.experimentResultDataStatus[id] = RequestStatus.Fulfilled;
    });
    builder.addCase(makeGetExperimentResultData.rejected, (state, { meta }) => {
      const id = meta.arg;
      state.experimentResultDataStatus[id] = RequestStatus.Rejected;
    });
  },
});

export const {
  clearIndividualCache,
  clearPhenopacketCache,
  clearBiosampleCache,
  clearExperimentCache,
  clearExperimentResultCache,
} = clinPhen.actions;
export default clinPhen.reducer;
