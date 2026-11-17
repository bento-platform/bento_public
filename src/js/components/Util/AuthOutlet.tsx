import { useQueryWithAuthIfAllowed } from '@/hooks';
import { Outlet } from 'react-router-dom';

const AuthOutlet = () => {
  useQueryWithAuthIfAllowed();

  return <Outlet />;
};

export default AuthOutlet;
