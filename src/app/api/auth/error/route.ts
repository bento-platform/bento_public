import { getServerJwt } from '@/auth';

const PUBLIC_URL_NO_TRAILING_SLASH = (process.env.BENTO_PUBLIC_URL ?? '').replace(/\/$/, '');

// Replaces the default Auth.js error page (see `pages.error` in auth.ts).
//
// When several tabs sign in at once, they share one `authjs.state` cookie, so the losing flow fails its callback with
// an error even though the winning flow already created a valid session. If a valid session exists, send the user
// back to the app instead of showing a dead-end error page.
export async function GET(request: Request) {
  const token = await getServerJwt(request);
  const hasValidSession = !!token?.access_token && !token.error && Date.now() < token.expires_at * 1000;

  if (hasValidSession) {
    return new Response(null, { status: 302, headers: { Location: `${PUBLIC_URL_NO_TRAILING_SLASH}/` } });
  }

  const error = new URL(request.url).searchParams.get('error') ?? 'Unknown';
  console.error(`[auth] sign-in failed with no valid session (error=${error})`);
  return new Response(
    `<!doctype html><title>Sign-in error</title><p>Sign-in failed. <a href="${PUBLIC_URL_NO_TRAILING_SLASH}/">Return to the app</a> and try again.</p>`,
    { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );
}
