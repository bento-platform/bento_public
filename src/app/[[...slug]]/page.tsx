'use client';

import dynamic from 'next/dynamic';

// The whole legacy app is mounted client-only: it relies on browser-only APIs (Leaflet, antd's
// cssinjs, react-router-dom's BrowserRouter reading window.location) that must never run during
// server rendering. This route is a catch-all so react-router-dom keeps handling all internal
// navigation, exactly like it did as a single-page app under webpack.
const App = dynamic(() => import('@/App'), { ssr: false });

export default function Page() {
  return <App />;
}
