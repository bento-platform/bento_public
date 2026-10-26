import type { NextRequest } from 'next/server';
import { getServerAccessToken } from '@/auth';
import { BFF_PREFIX, isBffService } from '@/constants/bff';

export const dynamic = 'force-dynamic';

// The gateway the proxy forwards to; the Next server reaches the Bento services the same way browsers do.
const UPSTREAM_URL = (process.env.BENTO_PUBLIC_URL ?? '').replace(/\/$/, '');

const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'range',
  'if-match',
  'if-none-match',
  'if-modified-since',
  'if-range',
];

// Not forwarded back: content-encoding/length describe the upstream's wire format, which fetch() has already decoded.
const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'content-disposition',
  'content-range',
  'accept-ranges',
  'etag',
  'last-modified',
  'cache-control',
  'expires',
  'vary',
];

const SAFE_METHODS = new Set(['GET', 'HEAD']);

const jsonError = (status: number, message: string) => Response.json({ message }, { status });

async function proxy(
  request: NextRequest,
  ctx: { params: Promise<{ service: string; path: string[] }> }
): Promise<Response> {
  const { service } = await ctx.params;
  if (!UPSTREAM_URL) return jsonError(500, 'Proxy upstream is not configured');
  if (!isBffService(service)) return jsonError(404, 'Unknown service');

  // Cookies are sent automatically on cross-site requests unless SameSite blocks them, so also verify the origin of
  // anything that can change state.
  if (!SAFE_METHODS.has(request.method)) {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(UPSTREAM_URL).origin) return jsonError(403, 'Cross-origin request refused');
  }

  // Use the raw pathname, so that trailing slashes and encoding reach the service unchanged.
  const servicePath = request.nextUrl.pathname.slice(`${BFF_PREFIX}/${service}`.length);
  if (servicePath.split('/').some((segment) => /^(\.|%2e){2}$/i.test(segment))) {
    return jsonError(400, 'Invalid path');
  }

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }

  const accessToken = await getServerAccessToken(request);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const hasBody = !SAFE_METHODS.has(request.method) && request.body !== null;
  let upstream: Response;
  try {
    upstream = await fetch(`${UPSTREAM_URL}/api/${service}${servicePath}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      // @ts-expect-error - `duplex` is required by Node's fetch to stream a request body but is missing from the types
      duplex: hasBody ? 'half' : undefined,
      redirect: 'manual',
      signal: request.signal,
    });
  } catch (err) {
    console.error(`Proxy request to ${service} failed`, err);
    return jsonError(502, 'Could not reach upstream service');
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value !== null) responseHeaders.set(name, value);
  }
  // Responses can depend on the user's token, so keep shared caches from storing them.
  responseHeaders.append('Vary', 'Cookie');
  if (accessToken && !responseHeaders.has('Cache-Control')) responseHeaders.set('Cache-Control', 'private');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export { proxy as GET, proxy as HEAD, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
