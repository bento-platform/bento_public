import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { SearchFieldResponse } from '@/types/search';
import { RootState } from '@/store';

export const makeGetSearchFields = createAsyncThunk<
  SearchFieldResponse,
  void,
  { rejectValue: string; state: RootState }
>('query/makeGetSearchFields', async (_, { rejectWithValue, getState }) => {
  return await axios
    .get(searchFieldsUrl, { params: getState().metadata.params })
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});
