import { useEffect } from 'react';

import { BEACON_NETWORK_ENABLED } from '@/config';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { getBeaconNetworkConfig } from '@/features/beacon/network.store';

import { getBeaconConfig } from './beacon.store';

export const useBeacon = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBeaconConfig());
  }, [dispatch]);

  return useAppSelector((state) => state.beacon);
};

export const useBeaconNetwork = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (BEACON_NETWORK_ENABLED) {
      dispatch(getBeaconNetworkConfig());
    }
  }, [dispatch]);

  return useAppSelector((state) => state.beaconNetwork);
};
