// Evaluated at request time since the same built image is reconfigured per-deployment via env vars.
export const dynamic = 'force-dynamic';

const parseBoolean = (value: string | undefined, defaultValue = ''): boolean =>
  ['true', 't', '1', 'yes'].includes((value || defaultValue).toLocaleLowerCase());

interface SiteConfig {
  // General branding and configuration
  CLIENT_NAME: string | null;
  ADMIN_URL: string | null;
  PUBLIC_URL: string | null;

  // Bento Public display flags
  TRANSLATED: boolean;
  TRANSLATED_LOGO: boolean;
  LOGO_HEIGHT: string;
  SHOW_LOGO: boolean;
  SHOW_HEADER_TITLE: boolean;
  SHOW_ADMIN_LINK: boolean;
  SHOW_SIGN_IN: boolean;
  FORCE_CATALOGUE: boolean;
  PCGL_MODE: boolean;

  // Theme variables
  CATALOGUE_HEADER_BACKGROUND: string | undefined;
  CATALOGUE_HEADER_TEXT_COLOR: string | undefined;

  // Beacon configuration and flags
  BEACON_URL: string | null;
  BEACON_UI_ENABLED: boolean;
  BEACON_NETWORK_ENABLED: boolean;

  // Authentication
  CLIENT_ID: string | null;
  OPENID_CONFIG_URL: string | null;
}

export function GET() {
  const siteConfig: SiteConfig = {
    // General branding and configuration
    CLIENT_NAME: process.env.BENTO_PUBLIC_CLIENT_NAME || null,
    // TODO: next version: remove deprecated env var
    ADMIN_URL: process.env.BENTO_PUBLIC_ADMIN_URL || process.env.BENTO_PUBLIC_PORTAL_URL || null,
    PUBLIC_URL: process.env.BENTO_PUBLIC_URL || null,

    // Bento Public display flags
    TRANSLATED: parseBoolean(process.env.BENTO_PUBLIC_TRANSLATED),
    TRANSLATED_LOGO: parseBoolean(process.env.BENTO_PUBLIC_TRANSLATED_LOGO),
    LOGO_HEIGHT: process.env.BENTO_PUBLIC_LOGO_HEIGHT || '32',
    SHOW_LOGO: parseBoolean(process.env.BENTO_PUBLIC_SHOW_LOGO, 'true'),
    SHOW_HEADER_TITLE: parseBoolean(process.env.BENTO_PUBLIC_SHOW_HEADER_TITLE, 'true'),
    SHOW_ADMIN_LINK: parseBoolean(
      process.env.BENTO_PUBLIC_SHOW_ADMIN_LINK || process.env.BENTO_PUBLIC_SHOW_PORTAL_LINK
    ),
    SHOW_SIGN_IN: parseBoolean(process.env.BENTO_PUBLIC_SHOW_SIGN_IN),
    FORCE_CATALOGUE: parseBoolean(process.env.BENTO_PUBLIC_FORCE_CATALOGUE), // Show data catalogue even with 1 project
    PCGL_MODE: parseBoolean(process.env.BENTO_PUBLIC_PCGL_MODE),

    // Theme variables
    CATALOGUE_HEADER_BACKGROUND: process.env.BENTO_PUBLIC_CATALOGUE_HEADER_BACKGROUND,
    CATALOGUE_HEADER_TEXT_COLOR: process.env.BENTO_PUBLIC_CATALOGUE_HEADER_TEXT_COLOR,

    // Beacon configuration and flags
    BEACON_URL: process.env.BEACON_URL || null,
    BEACON_UI_ENABLED: parseBoolean(process.env.BENTO_BEACON_UI_ENABLED),
    BEACON_NETWORK_ENABLED: parseBoolean(process.env.BENTO_BEACON_NETWORK_ENABLED),

    // Authentication
    CLIENT_ID: process.env.CLIENT_ID || null,
    OPENID_CONFIG_URL: process.env.OPENID_CONFIG_URL || null,
  };

  return new Response(`BENTO_PUBLIC_CONFIG = ${JSON.stringify(siteConfig, null, 2)};\n`, {
    headers: { 'Content-Type': 'application/javascript' },
  });
}
