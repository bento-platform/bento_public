import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { DrsRecord } from './types';
import { RequestStatus } from '@/types/requests';

import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';

import { printAPIError } from '@/utils/error.util';
import { authorizedRequestConfig } from '@/utils/requests';

const decodeDrsUri = (drsUri: string): string => {
  const drsUriParts = new URL(drsUri);
  return `https://${drsUriParts.host}/ga4gh/drs/v1/objects${drsUriParts.pathname}`;
};

export const getDrsRecord = createAsyncThunk<
  DrsRecord,
  string,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'drs/getDrsRecord',
  (drsUri, { getState, rejectWithValue }) => {
    const state = getState();
    const decodedUri = decodeDrsUri(drsUri);
    // Security: MUST only pass tokens to local DRS instance
    return axios
      .get(decodedUri, decodedUri.startsWith(PUBLIC_URL_NO_TRAILING_SLASH) ? authorizedRequestConfig(state) : undefined)
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    condition(drsUri, { getState }) {
      const {
        drs: { byUri },
      } = getState();

      const status = byUri[drsUri]?.status ?? RequestStatus.Idle;
      return status === RequestStatus.Idle;
    },
  }
);
