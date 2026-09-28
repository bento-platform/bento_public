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
  SHOW_DEV_SETTINGS: boolean; // Show a floating dev settings button for overriding config at runtime (testing only)
  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: string | undefined;
  CATALOGUE_HEADER_TEXT_COLOR: string | undefined;
  // Apply-for-access configuration and flags
  APPLY_FOR_ACCESS_URL: string | null;
  // Beacon configuration and flags
  BEACON_URL: string | null;
  BEACON_UI_ENABLED: boolean;
  BEACON_NETWORK_ENABLED: boolean;
  // Authentication
  SESSION_REFETCH_INTERVAL_SECONDS: string; // Seconds between session refreshes, as an integer string: e.g., '120'
}
