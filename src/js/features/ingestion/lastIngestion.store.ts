import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuLastIngestionsUrl, gohanLastIngestionsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';

import { LastIngestionDataTypeResponse, DataTypeMap } from '@/types/lastIngestionDataTypeResponse';

// Async thunks to fetch data from the two endpoints
export const fetchKatsuData = createAsyncThunk('dataTypes/fetchKatsuData', (_, { rejectWithValue }) =>
  axios
    .get(katsuLastIngestionsUrl)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue))
);

export const fetchGohanData = createAsyncThunk('dataTypes/fetchGohanData', (_, { rejectWithValue }) =>
  axios
    .get(gohanLastIngestionsUrl)
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue))
);

// Define the state structure
export interface DataTypeState {
  isFetchingKatsuData: boolean;
  isFetchingGohanData: boolean;
  dataTypes: DataTypeMap;
}

// Initialize the state
const initialDataTypeState: DataTypeState = {
  isFetchingKatsuData: false,
  isFetchingGohanData: false,
  dataTypes: {},
};

const reduceServiceDataTypes = (state: DataTypeState, { payload }: PayloadAction<LastIngestionDataTypeResponse[]>) => {
  state.dataTypes = {
    ...state.dataTypes,
    ...Object.fromEntries(payload.map((data) => [data.id, data])),
  };
};

// Create a slice to manage the state
const DataTypeStore = createSlice({
  name: 'dataTypes',
  initialState: initialDataTypeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchKatsuData.pending, (state) => {
      state.isFetchingKatsuData = true;
    });
    builder.addCase(fetchGohanData.pending, (state) => {
      state.isFetchingGohanData = true;
    });
    builder.addCase(fetchKatsuData.fulfilled, (state, action) => {
      reduceServiceDataTypes(state, action);
      state.isFetchingKatsuData = false;
    });
    builder.addCase(fetchGohanData.fulfilled, (state, action) => {
      reduceServiceDataTypes(state, action);
      state.isFetchingGohanData = false;
    });
    builder.addCase(fetchKatsuData.rejected, (state) => {
      state.isFetchingKatsuData = false;
    });
    builder.addCase(fetchGohanData.rejected, (state) => {
      state.isFetchingGohanData = false;
    });
  },
});

export default DataTypeStore.reducer;
