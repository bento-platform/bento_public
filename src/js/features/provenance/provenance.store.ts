import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { provenanceUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ProvenanceAPIResponse, ProvenanceStore } from '@/types/provenance';

export const makeGetProvenanceRequest = createAsyncThunk<ProvenanceAPIResponse, void, { rejectValue: string }>(
  'provenance/getProvenance',
  () =>
    axios
      .get(provenanceUrl)
      .then((res) => res.data)
      .catch(printAPIError)
);

export type ProvenanceState = {
  isFetching: boolean;
  data: ProvenanceStore;
};

const initialState: ProvenanceState = {
  isFetching: false,
  data: [],
};

const provenance = createSlice({
  name: 'provenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeGetProvenanceRequest.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(makeGetProvenanceRequest.fulfilled, (state, { payload }) => {
        state.data = payload.datasets.map((d) => ({ ...d, ...d.dats_file }));
        state.isFetching = false;
      })
      .addCase(makeGetProvenanceRequest.rejected, (state) => {
        state.isFetching = false;
      });
  },
});

export default provenance.reducer;
