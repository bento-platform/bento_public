import { useQueryWithAuthIfAllowed } from '@/hooks';
import { useSyncAccessToken } from '@/features/auth/hooks';
import { Outlet } from 'react-router-dom';

const AuthOutlet = () => {
  useSyncAccessToken();
  useQueryWithAuthIfAllowed();

  return <Outlet />;
};

export default AuthOutlet;
