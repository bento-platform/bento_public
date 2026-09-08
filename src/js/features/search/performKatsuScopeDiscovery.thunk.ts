import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { DiscoveryResponseOrMessage } from '@/types/discovery/response';
import type { RootState } from '@/store';
import { type AxiosError } from 'axios';
import { STALE_DISCOVERY_REJECTION } from './constants';
import { RequestStatus } from '@/types/requests';
import { getDiscovery } from '@/features/search/api';
import { scopeEqual } from '@/utils/router';
import { printAPIError } from '@/utils/error.util';

export const performKatsuScopeDiscovery = createAsyncThunk<
  [DiscoveryScopeSelection, DiscoveryResponseOrMessage],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'query/performKatsuScopeDiscovery',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const scopeSelectionAtDispatch = state.metadata.selectedScope;

    try {
      const res = await getDiscovery(state);

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
      const queryState = getState().query;
      const haveQuery = Boolean(Object.keys(queryState.filters).length || queryState.textQuery.length);
      const { status, invalid } = queryState.wholeScopeData;
      return haveQuery && (status === RequestStatus.Idle || (status !== RequestStatus.Pending && invalid));
    },
  }
);
