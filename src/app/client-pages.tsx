'use client';

import dynamic from 'next/dynamic';

// Page components load client-only, like the app shell (see ClientApp): they import browser-only modules such as
// '@/config'. Route page.tsx files re-export these.

export const LegacyPage = dynamic(() => import('@/components/BentoAppRouter').then((m) => m.LegacyPageContent), {
  ssr: false,
});

export const AboutPage = dynamic(() => import('@/components/About/AboutPage'), { ssr: false });
