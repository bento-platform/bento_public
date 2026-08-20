import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuDiscoveryMatchesExportFieldsUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import { RequestStatus } from '@/types/requests';
import type { ExportDataEntity, ExportField } from '@/types/entities';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const fetchDiscoveryMatchExportFields = createAsyncThunk<
  ExportField[],
  ExportDataEntity,
  { rejectValue: string; state: RootState }
>(
  'query/fetchDiscoveryMatchExportFields',
  (entity, { rejectWithValue, getState }) => {
    return axios
      .get(katsuDiscoveryMatchesExportFieldsUrl, scopedAuthorizedRequestConfig(getState(), [['_entity', entity]]))
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue));
  },
  {
    // Fields available per entity rarely change within a session, so skip re-fetching once cached.
    condition(entity, { getState }) {
      const { status, fields } = getState().query.exportFields[entity];
      return status !== RequestStatus.Pending && !fields;
    },
  }
);
