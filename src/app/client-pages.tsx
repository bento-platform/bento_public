'use client';

import dynamic from 'next/dynamic';

// Page components load client-only, like the app shell (see ClientApp): they import browser-only modules such as
// '@/config'. Route page.tsx files re-export these.

export const ExplorePage = dynamic(() => import('@/components/Explore/LandingPage'), { ssr: false });
export const AboutPage = dynamic(() => import('@/components/About/AboutPage'), { ssr: false });
export const PhenopacketPage = dynamic(() => import('@/components/ClinPhen/PhenopacketView'), { ssr: false });
export const NotFoundPage = dynamic(() => import('@/components/Util/NotFoundPage'), { ssr: false });

// Feature-gated pages: '@/config' is only imported client-side, inside the loader.
export const BeaconPage = dynamic(
  async () =>
    (await import('@/config')).BEACON_UI_ENABLED
      ? (await import('@/components/Beacon/BeaconQueryUi')).default
      : (await import('@/components/Util/NotFoundPage')).default,
  { ssr: false }
);

export const NetworkPage = dynamic(
  async () =>
    (await import('@/config')).BEACON_NETWORK_ENABLED
      ? (await import('@/components/Beacon/BeaconNetwork/NetworkUi')).default
      : (await import('@/components/Util/NotFoundPage')).default,
  { ssr: false }
);
