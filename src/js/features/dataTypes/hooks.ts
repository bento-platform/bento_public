import { useAppSelector } from '@/hooks';

export const useDataTypes = () => useAppSelector((state) => state.dataTypes);
