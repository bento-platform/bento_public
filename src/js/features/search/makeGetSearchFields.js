import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '../../constants/configConstants';
import { printAPIError } from '../../utils/error';

export const makeGetSearchFields = createAsyncThunk('query/makeGetSearchFields', async () => {
  return axios
    .get(searchFieldsUrl)
    .then((res) => res.data)
    .catch(printAPIError);
});

export default {
  [makeGetSearchFields.pending]: (state) => {
    state.isFetchingFields = true;
  },
  [makeGetSearchFields.fulfilled]: (state, { payload }) => {
    state.querySections = payload.sections;
    state.isFetchingFields = false;
  },
  [makeGetSearchFields.rejected]: (state) => {
    state.isFetchingFields = false;
  },
};
