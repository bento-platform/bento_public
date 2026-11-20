// Helpers for route handlers that call Bento services on behalf of the signed-in user.
// server-only fails the build if a Client Component imports this module.
import 'server-only';

import { makeAuthorizationHeader } from 'bento-auth-js';
import type { NextRequest } from 'next/server';
import { getServerAccessToken } from '@/auth';

const FORWARDED_REQUEST_HEADERS = [
  // So that services localize their responses.
  'accept-language',
  // Set by the gateway in front of us; keeps the client IP visible to downstream services.
  'x-forwarded-for',
];

/**
 * Headers for an upstream service call made for the current user: the bearer token from the session cookie (if any)
 * and the request headers in FORWARDED_REQUEST_HEADERS.
 */
export const makeUpstreamHeaders = async (request: NextRequest): Promise<Headers> => {
  const headers = new Headers(makeAuthorizationHeader(await getServerAccessToken(request)));
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }
  return headers;
};
