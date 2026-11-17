import { getServerJwt } from '@/auth';

const PUBLIC_URL_NO_TRAILING_SLASH = (process.env.BENTO_PUBLIC_URL ?? '').replace(/\/$/, '');
const SECURE = PUBLIC_URL_NO_TRAILING_SLASH.startsWith('https:');

// Keep in sync with AUTH_RETRY_PARAM in features/auth/hooks.ts.
const AUTH_RETRY_PARAM = 'auth_retry';
// Short-lived marker so a persistent failure shows the error page instead of retrying forever.
const RETRY_COOKIE = 'bento-auth-retry';
const RETRY_COOKIE_MAX_AGE_S = 60;

const redirect = (path: string, setCookie?: string) => {
  const headers = new Headers({ Location: `${PUBLIC_URL_NO_TRAILING_SLASH}${path}`, 'Cache-Control': 'no-store' });
  if (setCookie) headers.append('Set-Cookie', setCookie);
  return new Response(null, { status: 302, headers });
};

// Replaces the default Auth.js error page (see `pages.error` in auth.ts).
//
// Auth.js reports many callback failures the same way (error=Configuration, "state value could not be parsed"),
// including a missing `authjs.state` cookie. That cookie lives 15 minutes, so signing in on a login page left open
// longer fails the callback. A second sign-in then succeeds silently, since the identity provider session now exists.
export async function GET(request: Request) {
  const token = await getServerJwt(request);
  const hasValidSession = !!token?.access_token && !token.error && Date.now() < token.expires_at * 1000;

  // Another tab may already have signed in: nothing to retry.
  if (hasValidSession) return redirect('/');

  const hasRetried = (request.headers.get('cookie') ?? '').split(/;\s*/).some((c) => c.startsWith(`${RETRY_COOKIE}=`));
  const error = new URL(request.url).searchParams.get('error') ?? 'Unknown';

  if (!hasRetried) {
    console.warn(`[auth] sign-in failed with no valid session (error=${error}); retrying once`);
    const cookie = `${RETRY_COOKIE}=1; Path=/; Max-Age=${RETRY_COOKIE_MAX_AGE_S}; HttpOnly; SameSite=Lax${SECURE ? '; Secure' : ''}`;
    return redirect(`/?${AUTH_RETRY_PARAM}=1`, cookie);
  }

  console.error(`[auth] sign-in failed again after a retry (error=${error})`);
  return new Response(
    `<!doctype html><title>Sign-in error</title><p>Sign-in failed. <a href="${PUBLIC_URL_NO_TRAILING_SLASH}/">Return to the app</a> and try again.</p>`,
    { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );
}
