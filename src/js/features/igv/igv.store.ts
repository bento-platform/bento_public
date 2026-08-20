import axios from 'axios';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { igvGenomesUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';

import type { IgvReferenceDetails } from '@/types/clinPhen/igv';

const storeName = 'igv';

export type IgvGenomesState = {
  igvGenomesStatus: RequestStatus;
  igvGenomes: IgvReferenceDetails[];
  igvGenomesByID: Record<string, IgvReferenceDetails>;
  igvPosition: string[];
};

const initialState: IgvGenomesState = {
  igvGenomesStatus: RequestStatus.Idle,
  igvGenomes: [],
  igvGenomesByID: {},
  igvPosition: [],
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

const igvState = createSlice({
  name: storeName,
  initialState,
  reducers: {
    saveIgvPosition: (state, { payload }: PayloadAction<string[]>) => {
      state.igvPosition = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getIgvGenomes.pending, (state) => {
      state.igvGenomesStatus = RequestStatus.Pending;
    });
    builder.addCase(getIgvGenomes.fulfilled, (state, { payload }) => {
      payload = payload ?? [];
      state.igvGenomes = payload;
      state.igvGenomesByID = Object.fromEntries(payload.map((g) => [g.id, g]));
      state.igvGenomesStatus = RequestStatus.Fulfilled;
    });
    builder.addCase(getIgvGenomes.rejected, (state) => {
      state.igvGenomesStatus = RequestStatus.Rejected;
    });
  },
});

export const { saveIgvPosition } = igvState.actions;

export default igvState.reducer;
