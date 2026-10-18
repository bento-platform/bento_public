import type { ReactNode } from 'react';

// No IDs are known at build time: each path renders on its first visit and is then served as static (the pages render
// nothing server-side), so next/link can prefetch it.
export const generateStaticParams = () => [];

export default function ScopeLayout({ children }: { children: ReactNode }) {
  return children;
}
