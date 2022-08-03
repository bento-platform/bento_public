import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '../../constants/configConstants';

export const makeGetSearchFields = createAsyncThunk('query/makeGetSearchFields', async () => {
  try {
    return await axios.get(searchFieldsUrl).then((res) => res.data);
  } catch (error) {
    console.error(error);
    throw Error(error);
  }
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
