import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { phenopacketUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { PhenopacketListResponse } from '@/types/clinPhen/phenopacket';
import { RequestStatus } from '@/types/requests';

export const makeGetPhenopacketList = createAsyncThunk<
  PhenopacketListResponse,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetPhenopacketList',
  (_, { rejectWithValue, getState }) => {
    return axios
      .get(phenopacketUrl, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const state = getState().clinPhen;
      const cond = state.phenopacketListStatus !== RequestStatus.Pending;
      console.debug(
        ...(cond ? ['requesting phenopacket list'] : ['not requesting phenopacket list - already fetched or fetching'])
      );
      return cond;
    },
  }
);
