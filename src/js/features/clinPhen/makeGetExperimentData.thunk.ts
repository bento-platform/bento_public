import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { experimentUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import { RequestStatus } from '@/types/requests';

export const makeGetExperimentData = createAsyncThunk<
  Experiment,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetExperimentData',
  (id, { rejectWithValue, getState }) => {
    return axios
      .get(`${experimentUrl}/${id}`, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      const state = getState().clinPhen;
      return !!id && !state.experimentDataCache[id] && state.experimentDataCache[id] !== RequestStatus.Pending;
    },
  }
);
