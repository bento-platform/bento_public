'use client';

import dynamic from 'next/dynamic';

// ssr: false because the legacy app relies on browser-only APIs
// (Leaflet, antd's cssinjs, react-router-dom's BrowserRouter).
// TODO: Adapt paths to static routes
const App = dynamic(() => import('@/App'), { ssr: false });

export default function Page() {
  return <App />;
}
