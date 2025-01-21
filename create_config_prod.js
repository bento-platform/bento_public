const parseBoolean = (value) => ['true', 't', '1', 'yes'].includes((value || '').toLocaleLowerCase());

const siteConfig = {
  // General branding and configuration
  CLIENT_NAME: process.env.BENTO_PUBLIC_CLIENT_NAME || null,
  PORTAL_URL: process.env.BENTO_PUBLIC_PORTAL_URL || null,
  PUBLIC_URL: process.env.BENTO_PUBLIC_URL || null,

  // Bento Public display flags
  TRANSLATED: parseBoolean(process.env.BENTO_PUBLIC_TRANSLATED),
  SHOW_PORTAL_LINK: parseBoolean(process.env.BENTO_PUBLIC_SHOW_PORTAL_LINK),
  SHOW_SIGN_IN: parseBoolean(process.env.BENTO_PUBLIC_SHOW_SIGN_IN),

  // Beacon configuration and flags
  BEACON_URL: process.env.BEACON_URL || null,
  BEACON_UI_ENABLED: parseBoolean(process.env.BENTO_BEACON_UI_ENABLED),
  BEACON_NETWORK_ENABLED: parseBoolean(process.env.BENTO_BEACON_NETWORK_ENABLED),

  // Authentication
  CLIENT_ID: process.env.CLIENT_ID || null,
  OPENID_CONFIG_URL: process.env.OPENID_CONFIG_URL || null,
};

if (typeof require !== 'undefined' && require.main === module) {
  process.stdout.write(`BENTO_PUBLIC_CONFIG = ${JSON.stringify(siteConfig, null, 2)};\n`);
}

module.exports = {
  siteConfig,
};
