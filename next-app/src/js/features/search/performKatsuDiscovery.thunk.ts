import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';
import { katsuDiscoveryUrl } from '@/constants/configConstants';
import type { RootState } from '@/store';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import { RequestStatus } from '@/types/requests';
import { printAPIError } from '@/utils/error.util';
import { scopedAuthorizedRequestConfig } from '@/utils/requests';
import { scopeEqual } from '@/utils/router';
import { searchQueryParamsFromState } from './utils';

export const STALE_DISCOVERY_REJECTION = 'stale' as const;

export const performKatsuDiscovery = createAsyncThunk<
  [DiscoveryScopeSelection, DiscoveryResponseOrMessage],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/performKatsuDiscovery',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const scopeSelectionAtDispatch = state.metadata.selectedScope;

    try {
      const res = await axios
        .get(katsuDiscoveryUrl, scopedAuthorizedRequestConfig(state, searchQueryParamsFromState(state.query)))
        .then((res) => res.data);

      // Scope changed while the request was in flight — discard stale results
      if (!scopeEqual(scopeSelectionAtDispatch.scope, getState().metadata.selectedScope.scope)) {
        return rejectWithValue(STALE_DISCOVERY_REJECTION);
      }

      return [scopeSelectionAtDispatch, res] as [DiscoveryScopeSelection, DiscoveryResponseOrMessage];
    } catch (err) {
      return printAPIError(rejectWithValue)(err as AxiosError);
    }
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
