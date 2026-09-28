import 'server-only';

import type { PublicConfig } from '@/types/publicConfig';
import { stringToBoolean } from '@/utils/strings';

// Single source of truth for env var -> config mapping. Read per call, since the same built image is reconfigured
// per-deployment via env vars.

const env = (name: string): string | null => process.env[name] || null;
const flag = (name: string, default_: string = ''): boolean => stringToBoolean(process.env[name], default_);
const url = (value: string | null): string | null => value?.replace(/\/$/g, '') ?? null;

const parseLogoHeight = (value: string | null): number => {
  const height = parseInt(value ?? '32', 10);
  if (Number.isNaN(height)) throw new Error(`BENTO_PUBLIC_LOGO_HEIGHT must be an integer, got: ${value}`);
  return height;
};

export const readPublicConfig = (): PublicConfig => ({
  // General
  CLIENT_NAME: env('BENTO_PUBLIC_CLIENT_NAME'),
  // TODO: next version: remove deprecated env var BENTO_PUBLIC_PORTAL_URL
  ADMIN_URL: url(env('BENTO_PUBLIC_ADMIN_URL') ?? env('BENTO_PUBLIC_PORTAL_URL')),
  PUBLIC_URL: url(env('BENTO_PUBLIC_URL')),

  // Display flags
  TRANSLATED: flag('BENTO_PUBLIC_TRANSLATED'),
  TRANSLATED_LOGO: flag('BENTO_PUBLIC_TRANSLATED_LOGO'),
  LOGO_HEIGHT: parseLogoHeight(env('BENTO_PUBLIC_LOGO_HEIGHT')),
  SHOW_LOGO: flag('BENTO_PUBLIC_SHOW_LOGO', 'true'),
  SHOW_HEADER_TITLE: flag('BENTO_PUBLIC_SHOW_HEADER_TITLE', 'true'),
  // TODO: next version: remove deprecated env var BENTO_PUBLIC_SHOW_PORTAL_LINK
  SHOW_ADMIN_LINK: stringToBoolean(env('BENTO_PUBLIC_SHOW_ADMIN_LINK') ?? env('BENTO_PUBLIC_SHOW_PORTAL_LINK') ?? ''),
  SHOW_SIGN_IN: flag('BENTO_PUBLIC_SHOW_SIGN_IN'),
  FORCE_CATALOGUE: flag('BENTO_PUBLIC_FORCE_CATALOGUE'),
  PCGL_MODE: flag('BENTO_PUBLIC_PCGL_MODE'),

  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: env('BENTO_PUBLIC_CATALOGUE_HEADER_BACKGROUND'),
  CATALOGUE_HEADER_TEXT_COLOR: env('BENTO_PUBLIC_CATALOGUE_HEADER_TEXT_COLOR'),

  // Beacon configuration and flags
  BEACON_URL: url(env('BEACON_URL')),
  BEACON_UI_ENABLED: flag('BENTO_BEACON_UI_ENABLED'),
  BEACON_NETWORK_ENABLED: flag('BENTO_BEACON_NETWORK_ENABLED'),

  // Authentication
  CLIENT_ID: env('CLIENT_ID'),
  OPENID_CONFIG_URL: env('OPENID_CONFIG_URL'),
});
