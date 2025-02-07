import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { individualUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { Individual } from '@/types/clinphen/individual';

export const makeGetIndividualData = createAsyncThunk<
  Individual,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetIndividualData',
  (id, { rejectWithValue, getState }) => {
    return axios
      .get(`${individualUrl}/${id}`, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      console.log('requesting individual data for id', id);
      return !getState().query.isFetchingIndividualData[id] && !getState().query.individualDataCache[id];
    },
  }
);
