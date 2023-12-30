// /* global BENTO_WEB_CONFIG:false */
//
// export const BENTO_URL = BENTO_WEB_CONFIG.BENTO_URL ?? process.env.BENTO_URL ?? null;
// export const BENTO_PUBLIC_URL = BENTO_WEB_CONFIG.BENTO_PUBLIC_URL ?? process.env.BENTO_PUBLIC_URL ?? null;
// export const BENTO_URL_NO_TRAILING_SLASH = BENTO_URL.replace(/\/$/g, "");
//
// export const CLIENT_ID = BENTO_WEB_CONFIG.CLIENT_ID ?? process.env.CLIENT_ID ?? null;
// export const OPENID_CONFIG_URL = BENTO_WEB_CONFIG.OPENID_CONFIG_URL
//     ?? process.env.OPENID_CONFIG_URL ?? null;
//
// export const AUTH_CALLBACK_URL = `${BENTO_URL_NO_TRAILING_SLASH}/callback`;
// export const IDP_BASE_URL = OPENID_CONFIG_URL ? (new URL(OPENID_CONFIG_URL)).origin : null;
//
// export const BENTO_DROP_BOX_FS_BASE_PATH = BENTO_WEB_CONFIG.BENTO_DROP_BOX_FS_BASE_PATH ??
//     process.env.BENTO_DROP_BOX_FS_BASE_PATH ?? "/data";

export const BENTO_URL = 'https://bentov2.local';
export const BENTO_PUBLIC_URL = null;
export const BENTO_URL_NO_TRAILING_SLASH = BENTO_URL.replace(/\/$/g, '');

export const CLIENT_ID = 'local_bentov2';
export const OPENID_CONFIG_URL = 'https://bentov2auth.local/realms/bentov2/.well-known/openid-configuration';

export const AUTH_CALLBACK_URL = `${BENTO_URL_NO_TRAILING_SLASH}/#/callback`;
export const IDP_BASE_URL = null;

export const BENTO_DROP_BOX_FS_BASE_PATH = '/data';
