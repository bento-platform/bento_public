import type { ReactNode } from 'react';
import ScopedRouteGuard from '@/components/Util/ScopedRouteGuard';

export default function DatasetScopeLayout({ children }: { children: ReactNode }) {
  return <ScopedRouteGuard>{children}</ScopedRouteGuard>;
}
