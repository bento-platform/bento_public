import { getLoadedPublicConfig } from '@/publicConfig';
import { LOCALSTORAGE_DEV_SETTINGS_KEY } from '@/constants/ui';
import { toBffUrl } from '@/utils/bff';

// Evaluated once, after the page has fetched /public/config.json (see ClientApp.tsx)
const config = getLoadedPublicConfig();

// General
export const CLIENT_NAME = config.CLIENT_NAME ?? undefined;
export const ADMIN_URL = (config.ADMIN_URL ?? '') + '/';
export const PUBLIC_URL_NO_TRAILING_SLASH = config.PUBLIC_URL ?? '';
export const PUBLIC_URL = PUBLIC_URL_NO_TRAILING_SLASH + '/';

// Bento Public display flags
export const TRANSLATED = config.TRANSLATED;
export const TRANSLATED_LOGO = config.TRANSLATED_LOGO;
export const LOGO_HEIGHT = parseInt(config.LOGO_HEIGHT);
export const SHOW_LOGO = config.SHOW_LOGO;
export const SHOW_HEADER_TITLE = config.SHOW_HEADER_TITLE;
export const SHOW_ADMIN_LINK = config.SHOW_ADMIN_LINK;
export const SHOW_SIGN_IN = config.SHOW_SIGN_IN;
export const FORCE_CATALOGUE = config.FORCE_CATALOGUE;
export const SHOW_DEV_SETTINGS = config.SHOW_DEV_SETTINGS;

// Runtime overrides set via the dev settings float button; only honoured when dev settings are enabled, so stale
// localStorage values can't affect deployments without the flag.
export interface DevSettings {
  PCGL_MODE?: boolean;
}
const readDevSettings = (): DevSettings => {
  if (!SHOW_DEV_SETTINGS) return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCALSTORAGE_DEV_SETTINGS_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};
export const DEV_SETTINGS = readDevSettings();

export const CONFIGURED_PCGL_MODE = config.PCGL_MODE;
export const PCGL_MODE = DEV_SETTINGS.PCGL_MODE ?? CONFIGURED_PCGL_MODE;

// Apply-for-access configuration
export const APPLY_FOR_ACCESS_URL = config.APPLY_FOR_ACCESS_URL ?? '';

// Beacon configuration and flags
// Routed through the same-origin proxy (which adds the user's token) when it's a Bento service on this instance
export const BEACON_URL = config.BEACON_URL
  ? toBffUrl(config.BEACON_URL, PUBLIC_URL_NO_TRAILING_SLASH)
  : config.BEACON_URL;
export const BEACON_NETWORK_URL = BEACON_URL + '/network';
export const BEACON_UI_ENABLED = config.BEACON_UI_ENABLED;
export const BEACON_NETWORK_ENABLED = config.BEACON_NETWORK_ENABLED;

// Authentication
export const SESSION_REFETCH_INTERVAL_SECONDS = parseInt(config.SESSION_REFETCH_INTERVAL_SECONDS);
