import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { phenopacketUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { RequestStatus } from '@/types/requests';

export const makeGetPhenopacketData = createAsyncThunk<
  Phenopacket,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetPhenopacketData',
  (id, { rejectWithValue }) => {
    return axios
      .get(`${phenopacketUrl}/${id}`)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      const state = getState().clinPhen;
      const cond = !!id && !state.phenopacketDataCache[id] && state.phenopacketDataStatus[id] !== RequestStatus.Pending;
      return cond;
    },
  }
);
