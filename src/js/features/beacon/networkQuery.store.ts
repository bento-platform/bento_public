import { createAsyncThunk } from '@reduxjs/toolkit';
// import { makeAuthorizationHeader } from 'bento-auth-js';
import { RootState } from '@/store';
import { beaconApiError } from '@/utils/beaconApiError';
import { BeaconQueryPayload } from '@/types/beacon';
import { networkBeaconQuery } from './networkBeaconQuery.store';
import { BEACON_NETWORK_ROOT } from '@/constants/beaconConstants';

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = '/individuals';

const queryUrl = (beaconId: string, endpoint: string): string => {
  return BEACON_NETWORK_ROOT + '/beacons/' + beaconId + endpoint;
};

// probably more biolerplate below than needed
// we only really need to dispatch networkBeaconQuery() once for each beacon in the network
// correct implementation is left as an exercise for the reader
// These options all appear to have the same behaviour below:
//    return await Promise.all()
//    return Promise.all()
//    Promise.all() (no return statement)


export const beaconNetworkQuery = createAsyncThunk<void, BeaconQueryPayload, { state: RootState; rejectValue: string }>(
  'beaconNetwork/beaconNetworkQuery',
  async (payload, { getState, rejectWithValue, dispatch }) => {
    // no auth in network prototype
    // const token = getState().auth.accessToken;
    // const headers = makeAuthorizationHeader(token);


    const beacons = getState().beaconNetwork.beacons;
    return await Promise.all(
      beacons.map((b) => {
        const url = queryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
        return dispatch(networkBeaconQuery({ beaconId: b.id, url: url, payload: payload }));
      })
    ).catch(beaconApiError(rejectWithValue));
  }
);
