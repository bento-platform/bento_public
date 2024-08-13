import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { KatsuSearchResponse } from '@/types/search';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';

export const makeGetKatsuPublic = createAsyncThunk<
  KatsuSearchResponse,
  void,
  { state: RootState; rejectValue: string }
>('query/makeGetKatsuPublic', (_, { rejectWithValue, getState }) => {
  const state = getState();
  const scopeParams = state.metadata.selectedScope;
  const queryParams = { ...scopeParams, ...state.query.queryParams };

  return axios
    .get(katsuUrl, {
      ...authorizedRequestConfig(state),
      params: queryParams,
    })
    .then((res) => res.data)
    .catch(printAPIError(rejectWithValue));
});
