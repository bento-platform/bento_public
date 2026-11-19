import { PUBLIC_CONFIG } from '@/env.server';

// Not prerendered at build time: GET route handlers run per request by default (without Cache Components), and
// PUBLIC_CONFIG comes from env vars read at server start (see env.server.ts), so the same built image can be
// reconfigured per deployment.
export function GET() {
  if (!/^\d+$/.test(PUBLIC_CONFIG.LOGO_HEIGHT)) {
    return Response.json(
      { error: `BENTO_PUBLIC_LOGO_HEIGHT must be an integer number of pixels, got '${PUBLIC_CONFIG.LOGO_HEIGHT}'` },
      { status: 500 }
    );
  }
  return Response.json(PUBLIC_CONFIG);
}
