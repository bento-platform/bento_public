'use client';

import dynamic from 'next/dynamic';

// The app below the [lang]/i18n shell isn't set up for SSR - it (and things it pulls in, e.g. ResponsiveProvider's
// eager window.innerWidth read, or Leaflet in the provenance map) rely on browser-only APIs at module/render
// time, same as before this migration (App.tsx was previously loaded via dynamic(..., { ssr: false })). Layouts
// can't pass { ssr: false } to next/dynamic themselves (Server Component restriction), hence this wrapper.
const AppShell = dynamic(() => import('@/components/AppShell'), { ssr: false });

export default AppShell;
