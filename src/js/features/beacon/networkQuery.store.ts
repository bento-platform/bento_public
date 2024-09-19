import type { RootState, AppDispatch } from '@/store';
import { BeaconQueryPayload } from '@/types/beacon';
import { networkBeaconQuery } from './networkBeaconQuery.store';
import { BEACON_NETWORK_URL } from '@/config';

// can parameterize at some point in the future
const DEFAULT_QUERY_ENDPOINT = '/individuals';

const queryUrl = (beaconId: string, endpoint: string): string => {
  return BEACON_NETWORK_URL + '/beacons/' + beaconId + endpoint;
};

// plain redux thunk, no state updates
// dispatch a query for each beacon in the network
// no auth in network prototype
export const beaconNetworkQuery =
  (payload: BeaconQueryPayload) => (dispatch: AppDispatch, getState: () => RootState) => {
    const beacons = getState().beaconNetwork.beacons;
    beacons.forEach((b) => {
      const url = queryUrl(b.id, DEFAULT_QUERY_ENDPOINT);
      dispatch(networkBeaconQuery({ beaconId: b.id, url: url, payload: payload }));
    });
  };
