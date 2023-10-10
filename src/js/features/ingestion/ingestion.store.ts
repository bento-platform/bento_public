import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { lastIngestionsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { IngestionData, LastIngestionResponse } from '@/types/lastIngestionResponse';

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
  ingestionData: IngestionData[];
  lastEndTimesByDataType: { [dataType: string]: string };
}

const initialState: IngestionDataState = {
  isFetchingIngestionData: false,
  ingestionData: [],
  lastEndTimesByDataType: {},
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
        payload.forEach((ingestion) => {
          const dataType = ingestion.details.request.tags.workflow_metadata.data_type;
          console.log("losDATATipes",dataType);
          //// here use dataType 
          const endTime = ingestion.details.run_log.end_time;
          const previousEndTime = state.lastEndTimesByDataType[dataType];
          if (!previousEndTime || new Date(endTime) > new Date(previousEndTime)) {
            state.lastEndTimesByDataType[dataType] = endTime;
          }
        });
        state.isFetchingIngestionData = false;
      }
    );
    builder.addCase(makeGetIngestionDataRequest.rejected, (state) => {
      state.isFetchingIngestionData = false;
    });
  },
});

export default IngestionDataStore.reducer;
