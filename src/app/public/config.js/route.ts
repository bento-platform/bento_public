// Ports create_config_prod.js: serves the same BENTO_PUBLIC_CONFIG global previously written to
// dist/public/config.js at container start. As a route handler it's evaluated per-request against
// the live process.env instead, so no build/entrypoint step needs to generate it.

// Force this to be evaluated at request time (not baked in at `next build` time), since the whole
// point is that the same built image is reconfigured per-deployment via env vars.
export const dynamic = 'force-dynamic';

const parseBoolean = (value: string | undefined, defaultValue = ''): boolean =>
  ['true', 't', '1', 'yes'].includes((value || defaultValue).toLocaleLowerCase());

export function GET() {
  const siteConfig = {
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
