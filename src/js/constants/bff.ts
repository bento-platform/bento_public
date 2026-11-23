// Same-origin proxy ("backend for frontend") for Bento service APIs. The browser calls /api/bff/<service>/... with
// only its session cookie; the Next server attaches the access token and forwards to /api/<service>/... on the
// gateway, so the access token never has to be exposed to the browser.
// This module must stay free of browser-only and server-only imports; it is shared by both sides.

export const BFF_PREFIX = '/api/bff';

// Services (the path segment after /api/ on the gateway) the proxy is allowed to forward to.
export const BFF_SERVICES = ['metadata', 'reference', 'authorization', 'service-registry', 'drs', 'beacon'] as const;
export type BffService = (typeof BFF_SERVICES)[number];
