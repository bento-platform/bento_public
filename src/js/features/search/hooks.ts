import { useAppSelector } from '@/hooks';

export const useSearchQuery = () => useAppSelector((state) => state.query);
