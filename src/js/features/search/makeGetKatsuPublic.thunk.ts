import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuPublicSearchUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { KatsuSearchResponse } from '@/types/search';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const makeGetKatsuPublic = createAsyncThunk<
  KatsuSearchResponse,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetKatsuPublic',
  (_, { rejectWithValue, getState }) => {
    const state = getState();
    return axios
      .get(katsuPublicSearchUrl, scopedAuthorizedRequestConfig(state, state.query.queryParams))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return !getState().query.isFetchingData;
    },
  }
);
