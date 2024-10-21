import { useAppSelector } from '@/hooks';

export const useBeacon = () => useAppSelector((state) => state.beacon);
export const useBeaconNetwork = () => useAppSelector((state) => state.beaconNetwork);
