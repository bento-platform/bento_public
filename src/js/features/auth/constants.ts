// Server and client both import this (keep it dependency-free); the id also forms /api/auth/callback/<id>.
export const BENTO_OIDC_PROVIDER_ID = 'bento';

// Not exported by bento-auth-js 8.0.0 yet; move it there later. Given by query:data; PCGL can also grant it (DACO).
export const downloadMetadata = 'download:metadata';
