export const makeAuthorizationHeader = (token: string | null | undefined): Record<string, string | never> =>
  token ? { Authorization: `Bearer ${token}` } : {};
