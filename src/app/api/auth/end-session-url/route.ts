import { getEndSessionEndpoint, getServerJwt } from '@/auth';
import { CLIENT_ID, PUBLIC_URL } from '@/env.server';

// Builds the identity provider's RP-initiated logout URL server-side.
export async function GET(request: Request) {
  try {
    const endSessionEndpoint = await getEndSessionEndpoint();
    if (!endSessionEndpoint) return Response.json({ endSessionUrl: null });

    const url = new URL(endSessionEndpoint);
    const idToken = (await getServerJwt(request))?.id_token;
    if (idToken) url.searchParams.set('id_token_hint', idToken);
    if (CLIENT_ID) url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('post_logout_redirect_uri', `${PUBLIC_URL}/`);
    return Response.json({ endSessionUrl: url.toString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('Error discovering end_session_endpoint', err);
    return Response.json({ endSessionUrl: null });
  }
}
