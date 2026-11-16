import { CLIENT_ID, getEndSessionEndpoint } from '@/auth';

export async function GET() {
  try {
    const endSessionEndpoint = await getEndSessionEndpoint();
    return Response.json({ endSessionEndpoint: endSessionEndpoint ?? null, clientId: CLIENT_ID });
  } catch (err) {
    console.error('Error discovering end_session_endpoint', err);
    return Response.json({ endSessionEndpoint: null, clientId: CLIENT_ID });
  }
}
