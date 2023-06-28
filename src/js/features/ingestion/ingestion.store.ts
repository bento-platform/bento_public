import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { lastIngestionsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { ingestionData, LastIngestionResponse } from '@/types/lastIngestionResponse';

export const makeGetIngestionDataRequest = createAsyncThunk<LastIngestionResponse, void, { rejectValue: string }>(
  'ingestionData/getIngestionData',
  (_, { rejectWithValue }) =>
    axios
      .get(lastIngestionsUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export interface IngestionDataState {
  isFetchingIngestionData: boolean;
  ingestionData: ingestionData[];
}

const initialState: IngestionDataState = {
  isFetchingIngestionData: false,
  ingestionData: [],
};

const IngestionDataStore = createSlice({
  name: 'ingestionData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(makeGetIngestionDataRequest.pending, (state) => {
      state.isFetchingIngestionData = true;
    });
    builder.addCase(
      makeGetIngestionDataRequest.fulfilled,
      (state, { payload }: PayloadAction<LastIngestionResponse>) => {
        state.ingestionData = payload;
        state.isFetchingIngestionData = false;
      }
    );
    builder.addCase(makeGetIngestionDataRequest.rejected, (state) => {
      state.isFetchingIngestionData = false;
    });
  },
});

export default IngestionDataStore.reducer;
