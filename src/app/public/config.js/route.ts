import { PUBLIC_CONFIG } from '@/env.server';

// Evaluated at request time since the same built image is reconfigured per-deployment via env vars.
export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(`BENTO_PUBLIC_CONFIG = ${JSON.stringify(PUBLIC_CONFIG, null, 2)};\n`, {
    headers: { 'Content-Type': 'application/javascript' },
  });
}
