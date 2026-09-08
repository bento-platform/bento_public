import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signOut, useSession } from 'next-auth/react';

import { PUBLIC_URL_NO_TRAILING_SLASH } from '@/config';
import type { AppDispatch, RootState } from '@/store';
import { type Resource, makeResourceKey } from './resources';
import { fetchResourcesPermissions, setAccessToken } from './authSlice';
import { makeAuthorizationHeader } from './utils';

const BENTO_OIDC_PROVIDER_ID = 'bento';

export const useIsAuthenticated = (): boolean => useSession().status === 'authenticated';

export const useAccessToken = (): string | undefined => useSession().data?.accessToken;

// Mirrors the Auth.js session's access token into Redux, so `getState()`-only Redux thunks (which can't call
// `useSession()` themselves) can still read it synchronously via `state.auth.accessToken`, the same way they did
// when bento-auth-js stored the token in Redux directly. Call this once, near the app root.
export const useSyncAccessToken = () => {
  const dispatch: AppDispatch = useDispatch();
  const accessToken = useAccessToken();
  useEffect(() => {
    dispatch(setAccessToken(accessToken));
  }, [dispatch, accessToken]);
};

export const useAuthorizationHeader = () => {
  const accessToken = useAccessToken();
  return useMemo(() => makeAuthorizationHeader(accessToken), [accessToken]);
};

type BaseResourcePermissionsState = {
  isFetching: boolean;
  hasAttempted: boolean;
  error: string;
};
type ResourcePermissionsState = BaseResourcePermissionsState & { permissions: string[] };
type ResourceHasPermissionState = BaseResourcePermissionsState & { hasPermission: boolean };

export const useResourcesPermissions = (
  resources: Resource[],
  authzUrl: string | undefined
): Record<string, ResourcePermissionsState> => {
  const dispatch: AppDispatch = useDispatch();

  const { status: sessionStatus, data: session } = useSession();
  const accessToken = session?.accessToken;

  const keys = useMemo(() => resources.map((resource) => makeResourceKey(resource)), [resources]);

  const resourcePermissions = useSelector((state: RootState) => state.auth.resourcePermissions);

  useEffect(() => {
    const anyFetching = keys.some((key) => !!resourcePermissions[key]?.isFetching);
    const allHavePermissions = keys.every((key) => !!resourcePermissions[key]?.permissions?.length);
    const allAttempted = keys.every((key) => !!resourcePermissions[key]?.hasAttempted);

    // If the session is still loading, or any permissions are currently fetching, or all requested permissions have
    // already been tried/returned, we don't need to dispatch the fetch action:
    if (!authzUrl || sessionStatus === 'loading' || anyFetching || allHavePermissions || allAttempted) return;

    dispatch(fetchResourcesPermissions({ resources, authzUrl, accessToken }));
  }, [dispatch, keys, resources, resourcePermissions, authzUrl, sessionStatus, accessToken]);

  // Construct an object with resource keys yielding an object containing the permissions on the object
  return useMemo(
    () =>
      Object.fromEntries(
        keys.map((key) => {
          const { permissions, isFetching, hasAttempted, error } = resourcePermissions[key] ?? {};
          return [
            key,
            {
              permissions: permissions ?? [],
              isFetching: isFetching ?? false,
              hasAttempted: hasAttempted ?? false,
              error: error ?? '',
            },
          ];
        })
      ),
    [keys, resourcePermissions]
  );
};

export const useResourcePermissions = (resource: Resource, authzUrl: string | undefined): ResourcePermissionsState => {
  const key = makeResourceKey(resource);
  const resourcesPermissions = useResourcesPermissions([resource], authzUrl);
  return resourcesPermissions[key];
};

export const useHasResourcePermission = (
  resource: Resource,
  authzUrl: string | undefined,
  permission: string
): ResourceHasPermissionState => {
  const { permissions, ...props } = useResourcePermissions(resource, authzUrl) ?? {};
  return { ...props, hasPermission: permissions.includes(permission) };
};

export const usePerformAuth = () => useCallback(() => signIn(BENTO_OIDC_PROVIDER_ID), []);

// Signs out of this app *and* the identity provider (RP-initiated logout), so a re-visit doesn't silently pick the
// session back up. Falls back to a plain local sign-out if the provider doesn't support/expose end_session_endpoint.
export const usePerformSignOut = () => {
  const { data: session } = useSession();
  const idToken = session?.idToken;

  return useCallback(async () => {
    try {
      const res = await fetch('/api/auth/end-session-url');
      if (res.ok) {
        const { endSessionEndpoint, clientId } = (await res.json()) as {
          endSessionEndpoint: string | null;
          clientId: string | null;
        };
        if (endSessionEndpoint) {
          const url = new URL(endSessionEndpoint);
          if (idToken) url.searchParams.set('id_token_hint', idToken);
          if (clientId) url.searchParams.set('client_id', clientId);
          url.searchParams.set('post_logout_redirect_uri', `${PUBLIC_URL_NO_TRAILING_SLASH}/`);

          await signOut({ redirect: false }); // clear our own session first - we've already captured idToken above
          window.location.href = url.toString(); // ...then hand off to the identity provider to end its session too
          return;
        }
      }
    } catch (err) {
      console.error('Error building identity provider end-session URL', err);
    }
    // Fallback: provider doesn't support RP-initiated logout, or discovery failed.
    await signOut();
  }, [idToken]);
};
