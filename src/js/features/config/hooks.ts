import { useAppSelector } from '@/hooks';

export const useConfig = () => {
  const { configStatus, configIsInvalid, countThreshold, maxQueryParameters } = useAppSelector((state) => state.config);

  return { configStatus, configIsInvalid, countThreshold, maxQueryParameters };
};
