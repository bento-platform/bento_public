import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Minimal .next/standalone server bundle, so the production Docker image skips a full `npm ci`.
  output: 'standalone',

  // Allowlists the bentoctl dev stack's non-localhost domain for next dev's same-origin HMR/asset check.
  allowedDevOrigins: process.env.BENTO_PUBLIC_URL ? [new URL(process.env.BENTO_PUBLIC_URL).hostname] : [],

  skipTrailingSlashRedirect: true,

  // No build-time `env` mapping: it would inline process.env.X everywhere,
  // breaking the server-start reads in src/js/env.server.ts that let one built image be reconfigured per deployment.
};

export default nextConfig;
