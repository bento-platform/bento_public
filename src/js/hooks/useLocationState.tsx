import { useLocation } from 'react-router-dom';

export const useLocationState = () => {
  const location = useLocation();
  return location.state || {};
};
