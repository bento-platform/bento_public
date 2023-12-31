import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import { SearchFieldResponse } from '@/types/search';

export const makeGetSearchFields = createAsyncThunk<SearchFieldResponse, void, { rejectValue: string }>(
  'query/makeGetSearchFields',
  (_, { rejectWithValue }) =>
    axios
      .get(searchFieldsUrl)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))
);
