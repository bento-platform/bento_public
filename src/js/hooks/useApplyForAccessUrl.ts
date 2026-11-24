import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';
import { useIsAuthenticated } from '@/features/auth/hooks';

/** The URL to apply for dataset access at, or an empty string if APPLY_FOR_ACCESS_URL is not set. */
export const useApplyForAccessUrl = (): string => {
  const isAuthenticated = useIsAuthenticated();
  if (!APPLY_FOR_ACCESS_URL) return '';
  // If we're in PCGL mode, already have a PCGL account, and are signed in, force the auth flow to occur at the DACO
  // side.
  // TODO: more systematic, less hard-coded version to force SSO & preserve state?
  return PCGL_MODE && isAuthenticated ? `${APPLY_FOR_ACCESS_URL}/api/auth/login` : APPLY_FOR_ACCESS_URL;
};
