import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Minimal .next/standalone server bundle, so the production Docker image skips a full `npm ci`.
  output: 'standalone',

  // Allowlists the bentoctl dev stack's non-localhost domain for next dev's same-origin HMR/asset check.
  allowedDevOrigins: process.env.BENTO_PUBLIC_URL ? [new URL(process.env.BENTO_PUBLIC_URL).hostname] : [],
  
  skipTrailingSlashRedirect: true,

  // No build-time `env` mapping: it would inline process.env.X everywhere, 
  // breaking the live per-request reads in config.js/route.ts and service-info/route.ts.
};

export default nextConfig;
