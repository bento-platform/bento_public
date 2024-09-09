import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { SearchFieldResponse } from '@/types/search';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const makeGetSearchFields = createAsyncThunk<
  SearchFieldResponse,
  void,
  { rejectValue: string; state: RootState }
>('query/makeGetSearchFields', async (_, { rejectWithValue, getState }) => {
  return await axios
    .get(searchFieldsUrl, scopedAuthorizedRequestConfig(getState()))
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});
