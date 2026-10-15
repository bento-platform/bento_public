import { useLocation } from '@/hooks/router';

export const useLocationState = () => {
  const location = useLocation();
  return location.state || {};
};
