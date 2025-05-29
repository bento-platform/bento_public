import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuDiscoveryUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const performKatsuDiscovery = createAsyncThunk<
  DiscoveryResponseOrMessage,
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/performKatsuDiscovery',
  (_, { rejectWithValue, getState }) => {
    const state = getState();
    return axios
      .get(katsuDiscoveryUrl, scopedAuthorizedRequestConfig(state, state.query.filterQueryParams))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      const { filterQueryStatus, textQueryStatus } = getState().query;
      return filterQueryStatus !== RequestStatus.Pending && textQueryStatus !== RequestStatus.Pending;
    },
  }
);
