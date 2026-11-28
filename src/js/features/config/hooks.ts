import { useAppSelector } from '@/hooks';

export const useConfig = () => {
  const { configStatus, countThreshold, countRounding, maxQueryParameters } = useAppSelector((state) => state.config);

  return { configStatus, countThreshold, countRounding, maxQueryParameters };
};
