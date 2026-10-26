import { signIn } from '@/auth';
import { BENTO_OIDC_PROVIDER_ID } from '@/features/auth/constants';

const MESSAGES: Record<string, string> = {
  Configuration:
    'Authentication is misconfigured on the server (e.g. missing AUTH_SECRET or CLIENT_SECRET, or the identity ' +
    'provider is unreachable). Check the server logs for the "[auth]" error line for the exact cause.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign-in link is no longer valid.',
};
const DEFAULT_MESSAGE = 'An unexpected error occurred during sign-in.';

export default async function AuthErrorPage({ searchParams }: PageProps<'/auth-error'>) {
  const { error } = await searchParams;
  const code = Array.isArray(error) ? error[0] : error;

  return (
    <main style={{ maxWidth: 560, margin: '10vh auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>Sign-in error</h1>
      <p>{(code && MESSAGES[code]) ?? DEFAULT_MESSAGE}</p>
      {code && (
        <p>
          Error code: <code>{code}</code>
        </p>
      )}
      <form
        action={async () => {
          'use server';
          await signIn(BENTO_OIDC_PROVIDER_ID, { redirectTo: '/' });
        }}
      >
        <button type="submit">Try again</button> <a href="/">Back to home</a>
      </form>
    </main>
  );
}
