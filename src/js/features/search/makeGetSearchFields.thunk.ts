import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { searchFieldsUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import type { SearchFieldResponse } from '@/features/search/types';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const makeGetSearchFields = createAsyncThunk<
  SearchFieldResponse,
  void,
  { rejectValue: string; state: RootState }
>(
  'query/makeGetSearchFields',
  (_, { rejectWithValue, getState }) => {
    return axios
      .get(searchFieldsUrl, scopedAuthorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().query.fieldsStatus !== RequestStatus.Pending;
    },
  }
);
