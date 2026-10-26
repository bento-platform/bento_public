import { signIn } from '@/auth';
import { BENTO_OIDC_PROVIDER_ID } from '@/features/auth/constants';
import AuthErrorClient from './AuthErrorClient';

export default async function AuthErrorPage({ searchParams }: PageProps<'/auth-error'>) {
  const { error } = await searchParams;
  const code = Array.isArray(error) ? error[0] : error;

  const retry = async () => {
    'use server';
    await signIn(BENTO_OIDC_PROVIDER_ID, { redirectTo: '/' });
  };

  return <AuthErrorClient code={code} retry={retry} />;
}
