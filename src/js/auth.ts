import NextAuth from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers';
import type { JWT } from 'next-auth/jwt';

export const CLIENT_ID = process.env.CLIENT_ID ?? '';
const OPENID_CONFIG_URL = process.env.OPENID_CONFIG_URL ?? '';
const ISSUER = OPENID_CONFIG_URL.replace(/\/\.well-known\/.*$/, '');

type BentoTokenSet = {
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
};

const bentoProvider: OAuthConfig<Record<string, unknown>> = {
  id: 'bento',
  name: 'Bento',
  type: 'oidc',
  issuer: ISSUER,
  wellKnown: OPENID_CONFIG_URL,
  clientId: CLIENT_ID,
  checks: ['pkce', 'state'],
  client: { token_endpoint_auth_method: 'none' },
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
  cachedDiscovery = { doc, expiry: Date.now() + 3 * 60 * 60 * 1000 };
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
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    const detail = body?.error ? `: ${body.error} - ${body.error_description ?? ''}` : '';
    throw new Error(`Error encountered while refreshing token${detail}`);
  }
  return body as BentoTokenSet;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [bentoProvider],
  session: { strategy: 'jwt' },
  callbacks: {
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

      // Existing session, access token expired - attempt a refresh.
      if (!token.refresh_token) {
        return { ...token, error: 'RefreshTokenError' as const };
      }

      try {
        const refreshed = await refreshAccessToken(token.refresh_token);
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
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.access_token,
        idToken: token.id_token,
        error: token.error,
      };
    },
  },
});

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    idToken?: string;
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
