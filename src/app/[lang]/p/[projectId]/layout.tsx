import type { ReactNode } from 'react';
import ScopedRouteGuard from '@/components/Util/ScopedRouteGuard';

export default function ProjectScopeLayout({ children }: { children: ReactNode }) {
  return <ScopedRouteGuard>{children}</ScopedRouteGuard>;
}
