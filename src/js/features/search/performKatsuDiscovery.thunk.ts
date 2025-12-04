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

    try {
      const res = (await axios
        .get(
          katsuDiscoveryUrl,
          scopedAuthorizedRequestConfig(state, {
            _fts: state.query.textQuery || undefined,
            ...state.query.filterQueryParams,
          })
        )
        .then((res) => res.data)) as DiscoveryResponseOrMessage;

      return [state.metadata.selectedScope.scope, res] as [DiscoveryScope, DiscoveryResponseOrMessage];
    } catch (e) {
      throw printAPIError(rejectWithValue);
    }
  },
  {
    condition(_, { getState }) {
      const { discoveryStatus } = getState().query;
      const cond = discoveryStatus !== RequestStatus.Pending;
      if (!cond) {
        console.debug(
          'performKatsuDiscovery() was attempted, but will not dispatch: ' +
            `discoveryStatus=${RequestStatus[discoveryStatus]}`
        );
      }
      return cond;
    },
  }
);
