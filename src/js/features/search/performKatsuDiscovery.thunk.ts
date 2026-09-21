import { createAsyncThunk } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import { STALE_DISCOVERY_REJECTION } from './constants';
import type { RootState } from '@/store';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import { RequestStatus } from '@/types/requests';
import { fetchDiscovery } from '@/features/search/fetchDiscovery';
import { printAPIError } from '@/utils/error.util';
import { scopeEqual } from '@/utils/router';
import { searchQueryParamsFromState } from './utils';

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
      const res = await fetchDiscovery(state, searchQueryParamsFromState(state.query));

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
