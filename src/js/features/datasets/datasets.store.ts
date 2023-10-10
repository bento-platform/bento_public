import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { datasetsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';

// Type definition for Dataset response. You need to define this according to the response structure
interface DatasetResponse {
  // Define the structure based on the response of the /datasets endpoint.
  // Here's a placeholder type; replace with actual fields
  id: string;
  name: string;
  description: string;
}

export const fetchDatasets = createAsyncThunk<DatasetResponse[], void, { rejectValue: string }>(
  'datasets/fetchDatasets',
  (_, { rejectWithValue }) =>
    axios
      .get(datasetsUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);

export interface DatasetsState {
  isFetchingDatasets: boolean;
  datasets: DatasetResponse[];
}

const initialState: DatasetsState = {
  isFetchingDatasets: false,
  datasets: [],
};

const DatasetsStore = createSlice({
  name: 'datasets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDatasets.pending, (state) => {
      state.isFetchingDatasets = true;
    });
    builder.addCase(fetchDatasets.fulfilled, (state, { payload }: PayloadAction<DatasetResponse[]>) => {
      state.datasets = payload;
      state.isFetchingDatasets = false;
    });
    builder.addCase(fetchDatasets.rejected, (state) => {
      state.isFetchingDatasets = false;
    });
  },
});

export default DatasetsStore.reducer;
