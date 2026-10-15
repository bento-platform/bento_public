import { useQueryWithAuthIfAllowed } from '@/hooks';
import { useSyncAccessToken } from '@/features/auth/hooks';
import type { ReactNode } from 'react';

const AuthOutlet = ({ children }: { children: ReactNode }) => {
  useSyncAccessToken();
  useQueryWithAuthIfAllowed();

  return <>{children}</>;
};

export default AuthOutlet;
