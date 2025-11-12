import { stringToBoolean } from '@/utils/strings';

interface PublicConfig {
  // General
  CLIENT_NAME: string;
  PORTAL_URL: string;
  PUBLIC_URL: string;
  // Display flags
  TRANSLATED: boolean;
  SHOW_PORTAL_LINK: boolean;
  SHOW_SIGN_IN: boolean;
  FORCE_CATALOGUE: boolean; // Show data catalogue even with 1 project
  // Beacon configuration and flags
  BEACON_URL: string;
  BEACON_UI_ENABLED: boolean;
  BEACON_NETWORK_ENABLED: boolean;
  // Authentication
  CLIENT_ID: string;
  OPENID_CONFIG_URL: string;
}

// Declaration required for global config
declare let BENTO_PUBLIC_CONFIG: PublicConfig;

const stripTrailingSlash = (x: string): string => x.replace(/\/$/g, '');

// General
export const CLIENT_NAME = BENTO_PUBLIC_CONFIG.CLIENT_NAME ?? process.env.BENTO_PUBLIC_CLIENT_NAME;
const _PORTAL_URL = BENTO_PUBLIC_CONFIG.PORTAL_URL ?? process.env.BENTO_PUBLIC_PORTAL_URL;
export const PORTAL_URL = stripTrailingSlash(_PORTAL_URL) + '/';
const _PUBLIC_URL = BENTO_PUBLIC_CONFIG.PUBLIC_URL ?? process.env.BENTO_PUBLIC_URL ?? '';
export const PUBLIC_URL_NO_TRAILING_SLASH = stripTrailingSlash(_PUBLIC_URL);
export const PUBLIC_URL = PUBLIC_URL_NO_TRAILING_SLASH + '/';

// Bento Public display flags
export const TRANSLATED = BENTO_PUBLIC_CONFIG.TRANSLATED ?? stringToBoolean(process.env.BENTO_PUBLIC_TRANSLATED);
export const SHOW_PORTAL_LINK =
  BENTO_PUBLIC_CONFIG.SHOW_PORTAL_LINK ?? stringToBoolean(process.env.BENTO_PUBLIC_SHOW_PORTAL_LINK);
export const SHOW_SIGN_IN = BENTO_PUBLIC_CONFIG.SHOW_SIGN_IN ?? stringToBoolean(process.env.BENTO_PUBLIC_SHOW_SIGN_IN);
export const FORCE_CATALOGUE =
  BENTO_PUBLIC_CONFIG.FORCE_CATALOGUE ?? stringToBoolean(process.env.BENTO_PUBLIC_FORCE_CATALOGUE);

// Beacon configuration and flags
export const BEACON_URL = BENTO_PUBLIC_CONFIG.BEACON_URL ?? process.env.BEACON_URL;
export const BEACON_NETWORK_URL = BEACON_URL + '/network';
export const BEACON_UI_ENABLED =
  BENTO_PUBLIC_CONFIG.BEACON_UI_ENABLED ?? stringToBoolean(process.env.BENTO_BEACON_UI_ENABLED);
export const BEACON_NETWORK_ENABLED =
  BENTO_PUBLIC_CONFIG.BEACON_NETWORK_ENABLED ?? stringToBoolean(process.env.BENTO_BEACON_NETWORK_ENABLED);

// Authentication
export const CLIENT_ID = BENTO_PUBLIC_CONFIG.CLIENT_ID ?? process.env.CLIENT_ID ?? '';
export const OPENID_CONFIG_URL = BENTO_PUBLIC_CONFIG.OPENID_CONFIG_URL ?? process.env.OPENID_CONFIG_URL ?? '';
export const AUTH_CALLBACK_URL = `${PUBLIC_URL_NO_TRAILING_SLASH}/callback`;
