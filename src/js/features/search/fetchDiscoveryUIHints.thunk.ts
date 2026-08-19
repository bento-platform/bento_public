import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { DiscoveryUIHints } from '@/features/search/types';

import { katsuDiscoveryUIHintsUrl } from '@/constants/configConstants';
import { RequestStatus } from '@/types/requests';

import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const fetchDiscoveryUIHints = createAsyncThunk<
  DiscoveryUIHints,
  void,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'query/fetchDiscoveryUIHints',
  (_, { rejectWithValue, getState }) => {
    const state = getState();
    return axios
      .get(katsuDiscoveryUIHintsUrl, scopedAuthorizedRequestConfig(state)) // Doesn't change based on query, just scope
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(_, { getState }) {
      return getState().query.uiHints.status !== RequestStatus.Pending;
    },
  }
);
