import type { ReactNode } from 'react';
import { useQueryWithAuthIfAllowed } from '@/hooks';
import { useSyncAccessToken } from '@/features/auth/hooks';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  useSyncAccessToken();
  useQueryWithAuthIfAllowed();

  return <>{children}</>;
};

export default AuthGuard;
