import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload } from '@/types/beacon';
import { BeaconNetworkAggregatedResponse } from '@/types/beaconNetwork';
import { singleBeaconQuery } from './singleBeaconQuery.store';
import { BEACON_NETWORK_ROOT } from '@/constants/beaconConstants';

// probably more biolerplate here than needed
// we only really need to dispatch singleBeaconQuery() once for each beacon in the network

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = '/individuals';

const queryUrl = (beaconId: string, endpoint: string): string => {
  return BEACON_NETWORK_ROOT + 'beacons/' + beaconId + endpoint;
};

export const beaconNetworkQuery = createAsyncThunk<void, BeaconQueryPayload, { state: RootState; rejectValue: string }>(
  'beaconNetwork/beaconNetworkQuery',
  async (payload, { getState, rejectWithValue, dispatch }) => {
    // no auth in network prototype
    // const token = getState().auth.accessToken;
    // const headers = makeAuthorizationHeader(token);

    console.log('beaconNetworkQuery()');

    const beacons = getState().beaconNetworkConfig.networkBeacons;
    return await Promise.all(
      beacons.map((b) => {
        const url = queryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
        return dispatch(singleBeaconQuery({ beaconId: b.id, url: url, payload: payload }));
      })
    ).catch(beaconApiError(rejectWithValue));
  }
);

