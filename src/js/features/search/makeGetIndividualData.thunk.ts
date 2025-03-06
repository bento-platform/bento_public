import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { individualUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { Individual } from '@/types/clinphen/individual';
import { RequestStatus } from '@/types/requests';

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
      const state = getState().query;
      const cond = !state.individualDataCache[id] && state.individualDataStatus[id] !== RequestStatus.Pending;
      console.debug(
        ...(cond
          ? ['requesting individual data for id', id]
          : ['not requesting individual data for id', id, '- already fetched or fetching'])
      );
      return cond;
    },
  }
);
