'use client';

import dynamic from 'next/dynamic';
import { loadPublicConfig } from '@/publicConfig';

// ssr: false because the legacy app relies on browser-only APIs
// (Leaflet, antd's cssinjs, react-router-dom's BrowserRouter).
// Runtime config is fetched before importing the app, since config.ts reads it at module evaluation.
// TODO: Adapt paths to static routes
const App = dynamic(
  async () => {
    await loadPublicConfig();
    return import('@/App');
  },
  { ssr: false }
);

export default function Page() {
  return <App />;
}
