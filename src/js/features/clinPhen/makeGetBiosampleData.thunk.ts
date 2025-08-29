import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { biosampleUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { Biosample } from '@/types/clinPhen/biosample';
import { RequestStatus } from '@/types/requests';

export const makeGetBiosampleData = createAsyncThunk<
  Biosample,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetBiosampleData',
  (id, { rejectWithValue, getState }) => {
    return axios
      .get(`${biosampleUrl}/${id}`, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      const state = getState().clinPhen;
      return !!id && !state.biosampleDataCache[id] && state.biosampleDataCache[id] !== RequestStatus.Pending;
    },
  }
);
