import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { experimentResultUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import { RequestStatus } from '@/types/requests';

export const makeGetExperimentResultData = createAsyncThunk<
  ExperimentResult,
  number,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetExperimentResultData',
  (id, { rejectWithValue, getState }) => {
    return axios
      .get(`${experimentResultUrl}/${id}`, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      const state = getState().clinPhen;
      return (
        !!id && !state.experimentResultDataCache[id] && state.experimentResultDataCache[id] !== RequestStatus.Pending
      );
    },
  }
);
