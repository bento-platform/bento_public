import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuLastIngestionsUrl, gohanLastIngestionsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';

export interface DataTypeResponse {
  count: number | null;
  id: string;
  label: string;
  last_ingested: string | null;
  queryable: boolean;
}

export type DataResponseArray = DataTypeResponse[];

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
  isFetchingData: boolean;
  dataTypes: DataResponseArray;
}

// Initialize the state
const initialDataTypeState: DataTypeState = {
  isFetchingData: false,
  dataTypes: [],
};

const reduceServiceDataTypes = (state: DataTypeState, { payload }: PayloadAction<DataResponseArray>) => {
  const uniqueIds = new Set(state.dataTypes.map((data: DataTypeResponse) => data.id));
  const newData = payload.filter((data: DataTypeResponse) => !uniqueIds.has(data.id));
  state.dataTypes = [...state.dataTypes, ...newData];
  state.isFetchingData = false;
};

// Create a slice to manage the state
const DataTypeStore = createSlice({
  name: 'dataTypes',
  initialState: initialDataTypeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchKatsuData.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(fetchGohanData.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(fetchKatsuData.fulfilled, reduceServiceDataTypes);
    builder.addCase(fetchGohanData.fulfilled, reduceServiceDataTypes);
    builder.addCase(fetchKatsuData.rejected, (state) => {
      state.isFetchingData = false;
    });
    builder.addCase(fetchGohanData.rejected, (state) => {
      state.isFetchingData = false;
    });
  },
});

export default DataTypeStore.reducer;
