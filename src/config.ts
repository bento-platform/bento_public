import { stringToBoolean } from '@/utils/strings';

export interface PublicConfig {
  // General
  CLIENT_NAME: string | null;
  ADMIN_URL: string | null;
  PUBLIC_URL: string | null;
  // Display flags
  TRANSLATED: boolean; // Whether to show a language toggle
  TRANSLATED_LOGO: boolean; // Whether a translated version of the header logo is available/relevant
  LOGO_HEIGHT: string; // String representation of a logo height in pixels as an integer with no suffix: e.g., '32'
  SHOW_LOGO: boolean;
  SHOW_HEADER_TITLE: boolean; // Whether to show the CLIENT_NAME title text
  SHOW_ADMIN_LINK: boolean;
  SHOW_SIGN_IN: boolean;
  FORCE_CATALOGUE: boolean; // Show data catalogue even with 1 project
  PCGL_MODE: boolean; // Puts Bento Public in "PCGL mode", turning it into the PCGL research portal
  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: string | undefined;
  CATALOGUE_HEADER_TEXT_COLOR: string | undefined;
  // Beacon configuration and flags
  BEACON_URL: string | null;
  BEACON_UI_ENABLED: boolean;
  BEACON_NETWORK_ENABLED: boolean;
}

// Declaration required for global config, injected client-side via a <Script> tag (see layout.tsx) so a single
// built image can be reconfigured per-deployment via env vars, with no rebuild.
// Not available during server/edge module evaluation (e.g., proxy.ts, i18n.config.ts), so guard access with
// `typeof`, the only reference form that doesn't throw on an undeclared identifier; process.env.* is the
// fallback there, since Node/Edge (unlike the browser) has live access to it.
declare let BENTO_PUBLIC_CONFIG: PublicConfig;
const GLOBAL_CONFIG: Partial<PublicConfig> = typeof BENTO_PUBLIC_CONFIG !== 'undefined' ? BENTO_PUBLIC_CONFIG : {};

const stripTrailingSlash = (x: string): string => x.replace(/\/$/g, '');

// General
export const CLIENT_NAME = GLOBAL_CONFIG.CLIENT_NAME ?? process.env.BENTO_PUBLIC_CLIENT_NAME;
// TODO: next version: remove deprecated env var
const _ADMIN_URL =
  GLOBAL_CONFIG.ADMIN_URL ?? process.env.BENTO_PUBLIC_ADMIN_URL ?? process.env.BENTO_PUBLIC_PORTAL_URL ?? '';
export const ADMIN_URL = stripTrailingSlash(_ADMIN_URL) + '/';
const _PUBLIC_URL = GLOBAL_CONFIG.PUBLIC_URL ?? process.env.BENTO_PUBLIC_URL ?? '';
export const PUBLIC_URL_NO_TRAILING_SLASH = stripTrailingSlash(_PUBLIC_URL);
export const PUBLIC_URL = PUBLIC_URL_NO_TRAILING_SLASH + '/';

// Bento Public display flags
export const TRANSLATED = GLOBAL_CONFIG.TRANSLATED ?? stringToBoolean(process.env.BENTO_PUBLIC_TRANSLATED);
export const TRANSLATED_LOGO =
  GLOBAL_CONFIG.TRANSLATED_LOGO ?? stringToBoolean(process.env.BENTO_PUBLIC_TRANSLATED_LOGO);
export const LOGO_HEIGHT = parseInt((GLOBAL_CONFIG.LOGO_HEIGHT ?? process.env.BENTO_PUBLIC_LOGO_HEIGHT) || '32');
export const SHOW_LOGO = GLOBAL_CONFIG.SHOW_LOGO ?? stringToBoolean(process.env.BENTO_PUBLIC_SHOW_LOGO, 'true');
export const SHOW_HEADER_TITLE =
  GLOBAL_CONFIG.SHOW_HEADER_TITLE ?? stringToBoolean(process.env.BENTO_PUBLIC_SHOW_HEADER_TITLE, 'true');
export const SHOW_ADMIN_LINK =
  GLOBAL_CONFIG.SHOW_ADMIN_LINK ??
  stringToBoolean(process.env.BENTO_PUBLIC_SHOW_ADMIN_LINK || process.env.BENTO_PUBLIC_SHOW_PORTAL_LINK);
export const SHOW_SIGN_IN = GLOBAL_CONFIG.SHOW_SIGN_IN ?? stringToBoolean(process.env.BENTO_PUBLIC_SHOW_SIGN_IN);
export const FORCE_CATALOGUE =
  GLOBAL_CONFIG.FORCE_CATALOGUE ?? stringToBoolean(process.env.BENTO_PUBLIC_FORCE_CATALOGUE);
export const PCGL_MODE = GLOBAL_CONFIG.PCGL_MODE ?? stringToBoolean(process.env.BENTO_PUBLIC_PCGL_MODE);

// Theme variables
export const CATALOGUE_HEADER_BACKGROUND =
  GLOBAL_CONFIG.CATALOGUE_HEADER_BACKGROUND ?? process.env.BENTO_PUBLIC_CATALOGUE_HEADER_BACKGROUND;
export const CATALOGUE_HEADER_TEXT_COLOR =
  GLOBAL_CONFIG.CATALOGUE_HEADER_TEXT_COLOR ?? process.env.BENTO_PUBLIC_CATALOGUE_HEADER_TEXT_COLOR;

// Beacon configuration and flags
export const BEACON_URL = GLOBAL_CONFIG.BEACON_URL ?? process.env.BEACON_URL;
export const BEACON_NETWORK_URL = BEACON_URL + '/network';
export const BEACON_UI_ENABLED =
  GLOBAL_CONFIG.BEACON_UI_ENABLED ?? stringToBoolean(process.env.BENTO_BEACON_UI_ENABLED);
export const BEACON_NETWORK_ENABLED =
  GLOBAL_CONFIG.BEACON_NETWORK_ENABLED ?? stringToBoolean(process.env.BENTO_BEACON_NETWORK_ENABLED);
