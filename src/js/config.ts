/* global BENTO_PUBLIC_CONFIG:false */
import BENTO_PUBLIC_CONFIG  from "@public/config";

export const BENTO_PUBLIC_URL = BENTO_PUBLIC_CONFIG.BENTO_PUBLIC_URL ?? process.env.BENTO_PUBLIC_URL ?? "";
export const BENTO_URL_NO_TRAILING_SLASH = BENTO_PUBLIC_URL.replace(/\/$/g, "");

/** @type {string} */
export const CLIENT_ID = BENTO_PUBLIC_CONFIG.CLIENT_ID ?? process.env.CLIENT_ID ?? "";

/** @type {string} */
export const OPENID_CONFIG_URL = BENTO_PUBLIC_CONFIG.OPENID_CONFIG_URL
    ?? process.env.OPENID_CONFIG_URL ?? "";

export const AUTH_CALLBACK_URL = `${BENTO_URL_NO_TRAILING_SLASH}/#/callback`;
export const IDP_BASE_URL = OPENID_CONFIG_URL ? (new URL(OPENID_CONFIG_URL)).origin : null;
