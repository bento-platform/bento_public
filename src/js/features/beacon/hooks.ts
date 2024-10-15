import { useAppSelector } from '@/hooks';

export const useBeaconNetwork = () => useAppSelector((state) => state.beaconNetwork);
