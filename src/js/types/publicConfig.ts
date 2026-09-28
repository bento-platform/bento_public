// Runtime instance configuration, read from env vars by the server and served to the client as /public/config.json
export interface PublicConfig {
  // General
  CLIENT_NAME: string | null;
  ADMIN_URL: string | null; // No trailing slash
  PUBLIC_URL: string | null; // No trailing slash
  // Display flags
  TRANSLATED: boolean; // Whether to show a language toggle
  TRANSLATED_LOGO: boolean; // Whether a translated version of the header logo is available/relevant
  LOGO_HEIGHT: number; // Logo height in pixels
  SHOW_LOGO: boolean;
  SHOW_HEADER_TITLE: boolean; // Whether to show the CLIENT_NAME title text
  SHOW_ADMIN_LINK: boolean;
  SHOW_SIGN_IN: boolean;
  FORCE_CATALOGUE: boolean; // Show data catalogue even with 1 project
  PCGL_MODE: boolean; // Puts Bento Public in "PCGL mode", turning it into the PCGL research portal
  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: string | null;
  CATALOGUE_HEADER_TEXT_COLOR: string | null;
  // Beacon configuration and flags
  BEACON_URL: string | null;
  BEACON_UI_ENABLED: boolean;
  BEACON_NETWORK_ENABLED: boolean;
  // Authentication
  CLIENT_ID: string | null;
  OPENID_CONFIG_URL: string | null;
}
