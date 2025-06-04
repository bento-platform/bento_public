import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { phenopacketUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import { RequestStatus } from '@/types/requests';
import { useIsAuthenticated } from 'bento-auth-js/dist';

export const makeGetPhenopacketData = createAsyncThunk<
  Phenopacket,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/makeGetPhenopacketData',
  (id, { rejectWithValue, getState }) => {
    return axios
      .get(`${phenopacketUrl}/${id}`, authorizedRequestConfig(getState()))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(id, { getState }) {
      const isAuthenticated = useIsAuthenticated();
      const state = getState().clinPhen;
      const cond =
        !!isAuthenticated &&
        !!id &&
        !state.phenopacketDataCache[id] &&
        state.phenopacketDataStatus[id] !== RequestStatus.Pending;
      console.debug(
        ...(cond
          ? ['requesting phenopacket data for id', id]
          : ['not requesting phenopacket data for id', id, '- already fetched or fetching'])
      );
      return cond;
    },
  }
);
