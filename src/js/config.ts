import { getLoadedPublicConfig } from '@/publicConfig';

// Evaluated once, after the page has fetched /public/config.json (see app/[[...slug]]/page.tsx)
const config = getLoadedPublicConfig();

// General
export const CLIENT_NAME = config.CLIENT_NAME ?? undefined;
export const ADMIN_URL = (config.ADMIN_URL ?? '') + '/';
export const PUBLIC_URL_NO_TRAILING_SLASH = config.PUBLIC_URL ?? '';
export const PUBLIC_URL = PUBLIC_URL_NO_TRAILING_SLASH + '/';

// Bento Public display flags
export const TRANSLATED = config.TRANSLATED;
export const TRANSLATED_LOGO = config.TRANSLATED_LOGO;
export const LOGO_HEIGHT = config.LOGO_HEIGHT;
export const SHOW_LOGO = config.SHOW_LOGO;
export const SHOW_HEADER_TITLE = config.SHOW_HEADER_TITLE;
export const SHOW_ADMIN_LINK = config.SHOW_ADMIN_LINK;
export const SHOW_SIGN_IN = config.SHOW_SIGN_IN;
export const FORCE_CATALOGUE = config.FORCE_CATALOGUE;
export const PCGL_MODE = config.PCGL_MODE;

// Beacon configuration and flags
export const BEACON_URL = config.BEACON_URL;
export const BEACON_NETWORK_URL = BEACON_URL + '/network';
export const BEACON_UI_ENABLED = config.BEACON_UI_ENABLED;
export const BEACON_NETWORK_ENABLED = config.BEACON_NETWORK_ENABLED;

// Authentication
export const CLIENT_ID = config.CLIENT_ID ?? '';
export const OPENID_CONFIG_URL = config.OPENID_CONFIG_URL ?? '';
export const AUTH_CALLBACK_URL = `${PUBLIC_URL_NO_TRAILING_SLASH}/callback`;
