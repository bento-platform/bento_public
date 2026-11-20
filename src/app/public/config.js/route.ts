import { PUBLIC_CONFIG } from '@/env.server';

// Not prerendered at build time: GET route handlers run per request by default (without Cache Components), and
// PUBLIC_CONFIG comes from env vars read at server start (see env.server.ts), so the same built image can be
// reconfigured per deployment.
export function GET() {
  return new Response(`BENTO_PUBLIC_CONFIG = ${JSON.stringify(PUBLIC_CONFIG, null, 2)};\n`, {
    headers: { 'Content-Type': 'application/javascript' },
  });
}
