import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { katsuDiscoveryUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';

export const performKatsuDiscovery = createAsyncThunk<
  [DiscoveryScope, DiscoveryResponseOrMessage],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/performKatsuDiscovery',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const { filterQueryParams, textQuery, textQueryType } = state.query;
    const res = (await axios
      .get(
        katsuDiscoveryUrl,
        scopedAuthorizedRequestConfig(state, {
          _fts: textQuery || undefined,
          _fts_type: textQuery ? textQueryType : undefined,
          ...filterQueryParams,
        })
      )
      .then((res) => res.data)
      .catch(printAPIError(rejectWithValue))) as DiscoveryResponseOrMessage;

    return [state.metadata.selectedScope.scope, res] as [DiscoveryScope, DiscoveryResponseOrMessage];
  },
  {
    condition(_, { getState }) {
      const { discoveryStatus, resultCountsInvalid } = getState().query;
      return (
        discoveryStatus === RequestStatus.Idle || (discoveryStatus !== RequestStatus.Pending && resultCountsInvalid)
      );
    },
  }
);
