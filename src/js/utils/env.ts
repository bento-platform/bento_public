// Pure helpers for normalizing environment/config values.
// This module must stay free of env reads, globals, and browser-only or server-only imports; it is shared by both sides.

export const stripTrailingSlash = (x: string): string => x.replace(/\/$/, '');

export const stringToBoolean = (s: string | undefined, default_: string = '') =>
  ['true', 't', '1', 'yes'].includes((s || default_).toLocaleLowerCase());
