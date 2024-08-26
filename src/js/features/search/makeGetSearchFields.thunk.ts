import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { makeAuthorizationHeader } from 'bento-auth-js';
import { searchFieldsUrl } from '@/constants/configConstants';
import { printAPIError } from '@/utils/error.util';
import type { SearchFieldResponse } from '@/types/search';
import type { RootState } from '@/store';

export const makeGetSearchFields = createAsyncThunk<
  SearchFieldResponse,
  void,
  { rejectValue: string; state: RootState }
>('query/makeGetSearchFields', async (_, { rejectWithValue, getState }) => {
  return await axios
    .get(searchFieldsUrl, {
      headers: { ...makeAuthorizationHeader(getState().auth.accessToken) },
      params: getState().metadata.selectedScope,
    })
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});
