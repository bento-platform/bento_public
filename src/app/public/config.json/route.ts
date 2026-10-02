import { readPublicConfig } from '../../../server/publicConfig';

// Evaluated at request time since the same built image is reconfigured per-deployment via env vars.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(readPublicConfig());
}
