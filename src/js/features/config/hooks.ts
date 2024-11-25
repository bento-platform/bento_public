import { useAppSelector } from '@/hooks';

export const useConfig = () => useAppSelector((state) => state.config);
