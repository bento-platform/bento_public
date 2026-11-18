// Helpers for route handlers that call Bento services on behalf of the signed-in user.
// server-only fails the build if a Client Component imports this module.
import 'server-only';

import { makeAuthorizationHeader } from 'bento-auth-js';
import type { NextRequest } from 'next/server';
import { getServerAccessToken } from '@/auth';

/**
 * Headers for an upstream service call made for the current user: the bearer token from the session cookie (if any)
 * and the request's Accept-Language, so that services localize their responses.
 */
export const makeUpstreamHeaders = async (request: NextRequest): Promise<Headers> => {
  const headers = new Headers(makeAuthorizationHeader(await getServerAccessToken(request)));
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) headers.set('Accept-Language', acceptLanguage);
  return headers;
};
