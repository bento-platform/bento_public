import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { igvGenomesUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';

import { IgvReferenceDetails } from '@/types/clinPhen/igv';

const storeName = 'igv';

export type IgvGenomesState = {
  igvGenomesStatus: RequestStatus;
  igvGenomes: IgvReferenceDetails[];
  igvGenomesByID: Record<string, IgvReferenceDetails>;
};

const initialState: IgvGenomesState = {
  igvGenomesStatus: RequestStatus.Idle,
  igvGenomes: [],
  igvGenomesByID: {},
};

export const getIgvGenomes = createAsyncThunk<IgvReferenceDetails[], void, { state: RootState }>(
  `${storeName}/getIgvGenomes`,
  (_, { rejectWithValue }) => {
    return axios
      .get(igvGenomesUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const { igvGenomesStatus } = getState().igv;
      return igvGenomesStatus === RequestStatus.Idle;
    },
  }
);

const igvReference = createSlice({
  name: storeName,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getIgvGenomes.pending, (state) => {
      console.log('igv pending');

      state.igvGenomesStatus = RequestStatus.Pending;
    });
    builder.addCase(getIgvGenomes.fulfilled, (state, { payload }) => {
      console.log('igv fulfilled');

      payload = payload ?? [];
      state.igvGenomes = payload;
      state.igvGenomesByID = Object.fromEntries(payload.map((g) => [g.id, g]));
      console.log('igv loaded genomes');

      state.igvGenomesStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getIgvGenomes.rejected, (state) => {
      console.log('igv failed');

      state.igvGenomesStatus = RequestStatus.Rejected;
    });
  },
});

export default igvReference.reducer;
