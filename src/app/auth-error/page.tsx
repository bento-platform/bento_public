import { cookies } from 'next/headers';
import { signIn } from '@/auth';
import { BENTO_OIDC_PROVIDER_ID } from '@/features/auth/constants';
import AuthErrorClient from './AuthErrorClient';

// Not imported from configConstants: that module pulls in browser-only config.
const LNGS = ['en', 'fr'];
const LANG_PREFIX = new RegExp(`^/(${LNGS.join('|')})(?=/|$)`);

// Auth.js stores the page sign-in was started from in this cookie (__Secure- prefixed over https), and it survives
// the trip to the error page, so we can send the user back to where they were instead of the default /en/ root.
const getOriginalPath = async (): Promise<string | undefined> => {
  const jar = await cookies();
  const raw = (jar.get('__Secure-authjs.callback-url') ?? jar.get('authjs.callback-url'))?.value;
  if (!raw) return undefined;
  try {
    const url = new URL(raw, 'http://placeholder.invalid');
    // Only ever redirect to a path on this site; drop the cookie's origin.
    return url.pathname.startsWith('/') && !url.pathname.startsWith('//') ? url.pathname + url.search : undefined;
  } catch {
    return undefined;
  }
};

// The page the user was on, but in the given language (or that language's root if we don't know where they were).
const getTargetPath = (original: string | undefined, lang: string): string => {
  const lng = LNGS.includes(lang) ? lang : 'en';
  return original?.match(LANG_PREFIX) ? original.replace(LANG_PREFIX, `/${lng}`) : `/${lng}/`;
};

export default async function AuthErrorPage({ searchParams }: PageProps<'/auth-error'>) {
  const { error } = await searchParams;
  const code = Array.isArray(error) ? error[0] : error;
  const original = await getOriginalPath();

  const retry = async (lang: string) => {
    'use server';
    // Cookie is read again here: the action runs in a later request.
    await signIn(BENTO_OIDC_PROVIDER_ID, { redirectTo: getTargetPath(await getOriginalPath(), lang) });
  };

  const backHrefs = Object.fromEntries(LNGS.map((lang) => [lang, getTargetPath(original, lang)]));

  return <AuthErrorClient code={code} retry={retry} backHrefs={backHrefs} />;
}
