'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// ssr: false because the legacy app relies on browser-only APIs
// (Leaflet, antd's cssinjs).
const App = dynamic(() => import('@/App'), { ssr: false });

export default function ClientApp({ children }: { children: ReactNode }) {
  return <App>{children}</App>;
}
