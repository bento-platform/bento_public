import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { referenceGenomesUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';

import type { Genome } from './types';

const storeName = 'reference';

export type ReferenceState = {
  genomesStatus: RequestStatus;
  genomes: Genome[];
  genomesByID: Record<string, Genome>;
};

const initialState: ReferenceState = {
  genomesStatus: RequestStatus.Idle,
  genomes: [],
  genomesByID: {},
};

export const getGenomes = createAsyncThunk<Genome[], void, { state: RootState }>(
  `${storeName}/getGenomes`,
  (_, { rejectWithValue }) => {
    return axios
      .get(referenceGenomesUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const { genomesStatus } = getState().reference;
      return genomesStatus === RequestStatus.Idle;
    },
  }
);

const reference = createSlice({
  name: storeName,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getGenomes.pending, (state) => {
      state.genomesStatus = RequestStatus.Pending;
    });
    builder.addCase(getGenomes.fulfilled, (state, { payload }) => {
      payload = payload ?? [];
      state.genomes = payload;
      state.genomesByID = Object.fromEntries(payload.map((g) => [g.id, g]));
      state.genomesStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getGenomes.rejected, (state) => {
      state.genomesStatus = RequestStatus.Rejected;
    });
  },
});

export default reference.reducer;
