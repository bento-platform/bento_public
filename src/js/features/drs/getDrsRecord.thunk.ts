import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { DrsRecord } from './types';
import { RequestStatus } from '@/types/requests';

import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';
import { toBffUrl } from '@/constants/bff';

import { printAPIError } from '@/utils/error.util';

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
  (drsUri, { rejectWithValue }) => {
    // Security: only the local DRS instance gets the proxy (and so the user's token); other hosts are called directly.
    const decodedUri = toBffUrl(decodeDrsUri(drsUri), PUBLIC_URL_NO_TRAILING_SLASH);
    return axios
      .get(decodedUri)
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
