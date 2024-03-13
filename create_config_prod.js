const parseBoolean = (value) => ["true", "1", "yes"].includes((value || "").toLocaleLowerCase());

const siteConfig = {
    CLIENT_NAME: process.env.CLIENT_NAME || null,
    PORTAL_URL: process.env.BENTO_PUBLIC_PORTAL_URL || null,
    TRANSLATED: parseBoolean(process.env.BENTO_PUBLIC_TRANSLATED),
    BEACON_URL: process.env.BEACON_URL || null,
    BEACON_UI_ENABLED: parseBoolean(process.env.BENTO_BEACON_UI_ENABLED),

    // Authentication
    BENTO_PUBLIC_URL: process.env.BENTO_PUBLIC_URL || null,
    CLIENT_ID: process.env.CLIENT_ID || null,
    OPENID_CONFIG_URL: process.env.OPENID_CONFIG_URL || null,
};

if (typeof require !== "undefined" && require.main === module) {
    process.stdout.write(`BENTO_PUBLIC_CONFIG = ${JSON.stringify(siteConfig, null, 2)};\n`);
}

module.exports = {
    siteConfig,
};
