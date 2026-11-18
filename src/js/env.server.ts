// Server-side environment values, read and normalized in one place. Route handlers import these instead of process.env.
// server-only fails the build if a Client Component imports this module; browser code uses @/config instead.
import 'server-only';

import type { PublicConfig } from '@/config';
import { stringToBoolean, stripTrailingSlash } from '@/utils/env';

// Read at server start, not inlined at build time (no NEXT_PUBLIC_ prefix, no next.config `env` mapping), so the same
// built image can be reconfigured per deployment.
const env = (...names: string[]): string | undefined => names.map((n) => process.env[n]).find(Boolean);
const url = (...names: string[]): string => stripTrailingSlash(env(...names) ?? '');
const bool = (name: string, defaultValue = ''): boolean => stringToBoolean(env(name), defaultValue);

// All URLs below have no trailing slash, or are '' when unset.
export const PUBLIC_URL = url('BENTO_PUBLIC_URL');
// TODO: next version: remove deprecated BENTO_PUBLIC_PORTAL_URL
export const ADMIN_URL = url('BENTO_PUBLIC_ADMIN_URL', 'BENTO_PUBLIC_PORTAL_URL');
export const KATSU_URL = url('KATSU_URL');
export const AUTHZ_URL = url('BENTO_AUTHZ_SERVICE_URL');
export const BEACON_URL = url('BEACON_URL');
export const APPLY_FOR_ACCESS_URL = url('BENTO_PUBLIC_APPLY_FOR_ACCESS_URL');

// GA4GH service-info ID override
export const SERVICE_ID = env('SERVICE_ID');

// OIDC client
export const CLIENT_ID = env('CLIENT_ID') ?? '';
// Confidential client secret. Never expose to the browser.
export const CLIENT_SECRET = env('CLIENT_SECRET') ?? '';
// Full discovery document URL (…/.well-known/openid-configuration), so it is not slash-normalized.
export const OPENID_CONFIG_URL = env('OPENID_CONFIG_URL') ?? '';
// Session cookie encryption key. Left undefined when unset, so next-auth reports the missing secret itself.
export const AUTH_SECRET = env('AUTH_SECRET');

// Browser config, served as the BENTO_PUBLIC_CONFIG global by /public/config.js and read in @/config.
// Everything here is public: never add a secret.
export const PUBLIC_CONFIG: PublicConfig = {
  // General branding and configuration
  CLIENT_NAME: env('BENTO_PUBLIC_CLIENT_NAME') || null,
  ADMIN_URL: ADMIN_URL || null,
  PUBLIC_URL: PUBLIC_URL || null,

  // Bento Public display flags
  TRANSLATED: bool('BENTO_PUBLIC_TRANSLATED'),
  TRANSLATED_LOGO: bool('BENTO_PUBLIC_TRANSLATED_LOGO'),
  LOGO_HEIGHT: env('BENTO_PUBLIC_LOGO_HEIGHT') || '32',
  SHOW_LOGO: bool('BENTO_PUBLIC_SHOW_LOGO', 'true'),
  SHOW_HEADER_TITLE: bool('BENTO_PUBLIC_SHOW_HEADER_TITLE', 'true'),
  // TODO: next version: remove deprecated BENTO_PUBLIC_SHOW_PORTAL_LINK
  SHOW_ADMIN_LINK: stringToBoolean(env('BENTO_PUBLIC_SHOW_ADMIN_LINK', 'BENTO_PUBLIC_SHOW_PORTAL_LINK')),
  SHOW_SIGN_IN: bool('BENTO_PUBLIC_SHOW_SIGN_IN'),
  FORCE_CATALOGUE: bool('BENTO_PUBLIC_FORCE_CATALOGUE'), // Show data catalogue even with 1 project
  PCGL_MODE: bool('BENTO_PUBLIC_PCGL_MODE'),
  SHOW_DEV_SETTINGS: bool('BENTO_PUBLIC_SHOW_DEV_SETTINGS'), // Dev/staging testing only

  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: env('BENTO_PUBLIC_CATALOGUE_HEADER_BACKGROUND'),
  CATALOGUE_HEADER_TEXT_COLOR: env('BENTO_PUBLIC_CATALOGUE_HEADER_TEXT_COLOR'),

  // Apply-for-access configuration
  APPLY_FOR_ACCESS_URL: APPLY_FOR_ACCESS_URL || null,

  // Beacon configuration and flags
  BEACON_URL: BEACON_URL || null,
  BEACON_UI_ENABLED: bool('BENTO_BEACON_UI_ENABLED'),
  BEACON_NETWORK_ENABLED: bool('BENTO_BEACON_NETWORK_ENABLED'),

  // Authentication
  SESSION_REFETCH_INTERVAL_SECONDS: env('BENTO_PUBLIC_SESSION_REFETCH_INTERVAL_SECONDS') || '120',
};
