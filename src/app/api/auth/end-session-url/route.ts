import { CLIENT_ID, getEndSessionEndpoint } from '@/auth';

// Small, session-independent lookup so the client can build an RP-initiated logout URL (killing the identity
// provider's own session on sign-out, not just this app's) without exposing the full OIDC discovery URL/config to
// the client the way bento-auth-js used to.
export async function GET() {
  try {
    const endSessionEndpoint = await getEndSessionEndpoint();
    return Response.json({ endSessionEndpoint: endSessionEndpoint ?? null, clientId: CLIENT_ID });
  } catch (err) {
    console.error('Error discovering end_session_endpoint', err);
    return Response.json({ endSessionEndpoint: null, clientId: CLIENT_ID });
  }
}
