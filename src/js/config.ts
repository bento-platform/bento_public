interface PublicConfig {
  CLIENT_NAME: string;
  PORTAL_URL: string;
  TRANSLATED: boolean;
  BEACON_URL: string;
  BEACON_UI_ENABLED: boolean;
  PUBLIC_URL: string;
  CLIENT_ID: string;
  OPENID_CONFIG_URL: string;
}

// Declaration required for global config
declare let BENTO_PUBLIC_CONFIG: PublicConfig;

// General
export const CLIENT_NAME = BENTO_PUBLIC_CONFIG.CLIENT_NAME ?? process.env.BENTO_PUBLIC_CLIENT_NAME;
export const PORTAL_URL = BENTO_PUBLIC_CONFIG.PORTAL_URL ?? process.env.BENTO_PUBLIC_PORTAL_URL;
export const TRANSLATED = BENTO_PUBLIC_CONFIG.TRANSLATED ?? process.env.BENTO_PUBLIC_TRANSLATED;
export const BEACON_URL = BENTO_PUBLIC_CONFIG.BEACON_URL ?? process.env.BEACON_URL;
export const BEACON_UI_ENABLED = BENTO_PUBLIC_CONFIG.BEACON_UI_ENABLED ?? process.env.BENTO_BEACON_UI_ENABLED;

// Authentication
export const PUBLIC_URL = BENTO_PUBLIC_CONFIG.PUBLIC_URL ?? process.env.BENTO_PUBLIC_URL ?? '';
export const PUBLIC_URL_NO_TRAILING_SLASH = PUBLIC_URL.replace(/\/$/g, '');
export const CLIENT_ID = BENTO_PUBLIC_CONFIG.CLIENT_ID ?? process.env.CLIENT_ID ?? '';
export const OPENID_CONFIG_URL = BENTO_PUBLIC_CONFIG.OPENID_CONFIG_URL ?? process.env.OPENID_CONFIG_URL ?? '';
export const AUTH_CALLBACK_URL = `${PUBLIC_URL_NO_TRAILING_SLASH}/callback`;
