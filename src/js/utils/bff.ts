// Helpers for the same-origin BFF proxy (see @/constants/bff).
// This module must stay free of browser-only and server-only imports; it is shared by both sides.

import { BFF_PREFIX, BFF_SERVICES, type BffService } from '@/constants/bff';

export const isBffService = (service: string): service is BffService =>
  (BFF_SERVICES as readonly string[]).includes(service);

// Rewrites an absolute gateway service URL (e.g., <publicUrl>/api/drs/objects/x/download) to its proxied equivalent.
// URLs outside of the Bento instance, or for services not in the allowlist, are returned unchanged.
export const toBffUrl = (url: string, publicUrlNoTrailingSlash: string): string => {
  // GA4GH DRS URLs live outside of /api/drs on the gateway, but the DRS service is reachable at the same sub-path.
  const ga4ghDrsPrefix = `${publicUrlNoTrailingSlash}/ga4gh/drs/v1/`;
  if (url.startsWith(ga4ghDrsPrefix))
    return `${publicUrlNoTrailingSlash}${BFF_PREFIX}/drs/${url.slice(publicUrlNoTrailingSlash.length + 1)}`;
  const apiPrefix = `${publicUrlNoTrailingSlash}/api/`;
  if (!url.startsWith(apiPrefix)) return url;
  const rest = url.slice(apiPrefix.length);
  const service = rest.split(/[/?#]/, 1)[0];
  if (!isBffService(service)) return url;
  return `${publicUrlNoTrailingSlash}${BFF_PREFIX}/${rest}`;
};
