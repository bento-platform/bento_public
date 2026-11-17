import NextAuth from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { OAuthConfig } from 'next-auth/providers';
import type { JWT } from 'next-auth/jwt';
import { BENTO_OIDC_PROVIDER_ID } from '@/features/auth/constants';

export const CLIENT_ID = process.env.CLIENT_ID ?? '';
// Confidential client secret. Server-side only - never expose to the browser.
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? '';
const OPENID_CONFIG_URL = process.env.OPENID_CONFIG_URL ?? '';
const ISSUER = OPENID_CONFIG_URL.replace(/\/\.well-known\/.*$/, '');

type BentoTokenSet = {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
};

const bentoOidcProvider: OAuthConfig<Record<string, unknown>> = {
  id: BENTO_OIDC_PROVIDER_ID,
  name: 'Bento',
  type: 'oidc',
  issuer: ISSUER,
  wellKnown: OPENID_CONFIG_URL,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  checks: ['pkce', 'state'],
  client: { token_endpoint_auth_method: 'client_secret_post' },
  authorization: { params: { scope: 'openid email' } },
};

type OidcDiscoveryDocument = {
  token_endpoint: string;
  end_session_endpoint?: string;
};

let cachedDiscovery: { doc: OidcDiscoveryDocument; expiry: number } | undefined;

const getDiscoveryDocument = async (): Promise<OidcDiscoveryDocument> => {
  if (cachedDiscovery && Date.now() < cachedDiscovery.expiry) {
    return cachedDiscovery.doc;
  }
  const res = await fetch(OPENID_CONFIG_URL);
  if (!res.ok) throw new Error('Could not fetch identity provider configuration');
  const doc = (await res.json()) as OidcDiscoveryDocument;
  cachedDiscovery = { doc, expiry: Date.now() + 3 * 60 * 60 * 1000 }; // cache for 3 hours
  return doc;
};

const getTokenEndpoint = async (): Promise<string> => (await getDiscoveryDocument()).token_endpoint;

export const getEndSessionEndpoint = async (): Promise<string | undefined> =>
  (await getDiscoveryDocument()).end_session_endpoint;

const refreshAccessToken = async (refreshToken: string): Promise<BentoTokenSet> => {
  const tokenEndpoint = await getTokenEndpoint();
  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
      client_secret: CLIENT_SECRET,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    const detail = body?.error ? `: ${body.error} - ${body.error_description ?? ''}` : '';
    throw new Error(`Error encountered while refreshing token${detail}`);
  }
  return body as BentoTokenSet;
};

// Refresh tokens are single-use: share one in-flight refresh so concurrent requests don't fail with invalid_grant.
const inflightRefreshes = new Map<string, Promise<BentoTokenSet>>();

const refreshAccessTokenOnce = (refreshToken: string): Promise<BentoTokenSet> => {
  let p = inflightRefreshes.get(refreshToken);
  if (!p) {
    p = refreshAccessToken(refreshToken).finally(() => inflightRefreshes.delete(refreshToken));
    inflightRefreshes.set(refreshToken, p);
  }
  return p;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [bentoOidcProvider],
  session: { strategy: 'jwt' },
  callbacks: {
    // The returned token is the entire session, stored in an encrypted cookie sent to the frontend (wrapper JWT).
    // See: https://github.com/nextauthjs/next-auth/blob/a1a16a5a7780488c7449feece410033f445d0b31/packages/core/src/index.ts#L424-L433
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        // First-time sign-in: seed the token from the just-completed authorization code exchange.
        if (!account.access_token || !account.expires_at || !account.id_token) {
          throw new TypeError('Missing access_token, id_token, or expires_at from authorization response');
        }
        return {
          ...token,
          access_token: account.access_token,
          id_token: account.id_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          error: undefined,
        };
      }

      if (Date.now() < token.expires_at * 1000) {
        // Existing session, access token still valid.
        return token;
      }

      // A previous refresh already failed - don't retry the dead refresh token.
      if (token.error === 'RefreshTokenError') {
        return token;
      }

      // Existing session, access token expired - attempt a refresh.
      if (!token.refresh_token) {
        return { ...token, error: 'RefreshTokenError' as const };
      }

      try {
        const refreshed = await refreshAccessTokenOnce(token.refresh_token);
        return {
          ...token,
          access_token: refreshed.access_token,
          id_token: refreshed.id_token,
          expires_at: Math.floor(Date.now() / 1000 + refreshed.expires_in),
          // Not every grant necessarily returns a new refresh token - keep the old one if so.
          refresh_token: refreshed.refresh_token ?? token.refresh_token,
          error: undefined,
        };
      } catch (err) {
        console.error('Error refreshing access_token', err);
        return { ...token, error: 'RefreshTokenError' as const };
      }
    },
    // SAFETY: the value returned here is what gets exposed to the client (via useSession / the /api/auth/session
    // endpoint), so only put things in it that are safe to be visible in the browser. Never put the access, ID or
    // refresh tokens in it: the server reads those straight from the cookie (see getServerJwt).
    async session({ session, token }) {
      return { ...session, error: token.error };
    },
  },
});

// Server-only: reads the access token straight from the encrypted session cookie, without exposing it to the browser.
// This deliberately does not refresh an expired token - refresh tokens are single-use, and a refresh here couldn't
// persist the rotated token back to the cookie. Refreshing happens when the session endpoint is polled instead.
export const getServerJwt = (req: Request) =>
  getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: (process.env.BENTO_PUBLIC_URL ?? '').startsWith('https:'),
  });

export const getServerAccessToken = async (req: Request): Promise<string | undefined> => {
  const token = await getServerJwt(req);
  if (!token?.access_token || token.error || Date.now() >= token.expires_at * 1000) return undefined;
  return token.access_token;
};

// Defines the shape of the session and JWT for Bento Public - without this, accessing session.accessToken,
// token.access_token, etc. elsewhere would be a type error.
declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    id_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: 'RefreshTokenError';
  }
}
