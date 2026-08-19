import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produces a minimal .next/standalone server bundle (only the node_modules it actually needs),
  // so the production Docker image doesn't need a full `npm ci` in its final stage.
  output: 'standalone',

  // The bento dev stack (bentoctl) fronts this container at bentov2.local, not localhost, so `next
  // dev`'s default same-origin check on dev-only asset requests (HMR, _next/static chunks) blocks it
  // unless the host is explicitly allowlisted here.
  allowedDevOrigins: ['bentov2.local'],

  // The old nginx `try_files $uri $uri/ /index.html` never redirected based on a trailing slash --
  // it just served index.html either way. react-router-dom's own routes rely on both forms (e.g. the
  // `/:lang/*` catch-all's fallback navigates to `/en/`, with a trailing slash). Keep that exact
  // behavior instead of Next's default trailing-slash redirect, which would otherwise 308 those URLs.
  skipTrailingSlashRedirect: true,

  // No build-time `env` mapping here (unlike webpack.config.js's old EnvironmentPlugin): Next's `env`
  // config option inlines process.env.X globally, across server code too -- not just the client
  // bundle -- which would silently break the live, per-request process.env reads that
  // src/app/public/config.js/route.ts and src/app/service-info/route.ts depend on. Those two route
  // handlers are the single, always-live source of runtime config (see src/js/config.ts's
  // `BENTO_PUBLIC_CONFIG.X ?? process.env.X` fallback -- the `process.env.X` half is now effectively
  // dead code, since the route handler already reflects the current process.env by the time it runs).
};

export default nextConfig;
