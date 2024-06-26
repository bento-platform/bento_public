import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuUrl } from '@/constants/configConstants';
import { KatsuSearchResponse } from '@/types/search';
import { printAPIError } from '@/utils/error.util';
import { RootState } from '@/store';

export const makeGetKatsuPublic = createAsyncThunk<
  KatsuSearchResponse,
  void,
  { state: RootState; rejectValue: string }
>('query/makeGetKatsuPublic', (_ignore, thunkAPI) => {
  const queryParams = thunkAPI.getState().query.queryParams;

  return axios
    .get(katsuUrl, { params: queryParams })
    .then((res) => res.data)
    .catch(printAPIError(thunkAPI.rejectWithValue));
});
