'use client';

import dynamic from 'next/dynamic';
import { loadPublicConfig } from '@/publicConfig';

// ssr: false because the legacy app relies on browser-only APIs
// (Leaflet, antd's cssinjs, react-router-dom's BrowserRouter).
// The runtime config is fetched before importing the app, since config.ts reads it at module evaluation.
const App = dynamic(
  async () => {
    await loadPublicConfig();
    return import('@/App');
  },
  { ssr: false }
);

export default function ClientApp() {
  return <App />;
}
