import { useAppSelector } from '@/hooks';

export const useConfig = () => {
  const { configStatus, countThreshold, maxQueryParameters } = useAppSelector((state) => state.config);

  return { configStatus, countThreshold, maxQueryParameters };
};
