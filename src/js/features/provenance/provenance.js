import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { provenanceUrl } from '../../constants/configConstants';
import { printAPIError } from '../../utils/error';

export const makeGetProvenanceRequest = createAsyncThunk('provenance/getProvenance', async () => {
  return axios
    .get(provenanceUrl)
    .then((res) => res.data)
    .catch(printAPIError);
});

const initialState = {
  isFetching: false,
  data: [],
};

const provenance = createSlice({
  name: 'provenance',
  initialState,
  reducers: {},
  extraReducers: {
    [makeGetProvenanceRequest.pending]: (state) => {
      state.isFetching = true;
    },
    [makeGetProvenanceRequest.fulfilled]: (state, { payload }) => {
      // use the dats file if available, otherwise use whatever property has
      // been defined on the dataset
      state.data = payload.datasets.map((d) => ({ ...d, ...d.dats_file }));
      state.isFetching = false;
    },
    [makeGetProvenanceRequest.rejected]: (state) => {
      state.isFetching = false;
    },
  },
});

export default provenance.reducer;
