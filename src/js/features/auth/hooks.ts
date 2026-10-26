// The resource-permission fetch/cache hooks below (useResourcesPermissions, useResourcePermissions,
// useHasResourcePermission) are adapted from bento-auth-js's own hooks.ts, ported here to read the access token
// from the Auth.js session instead of bento-auth-js's Redux auth slice.
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signOut, useSession } from 'next-auth/react';

import type { AppDispatch, RootState } from '@/store';
import { type Resource, makeResourceKey } from 'bento-auth-js';
import { fetchResourcesPermissions } from './authSlice';
import { BENTO_OIDC_PROVIDER_ID } from './constants';

export const useIsAuthenticated = (): boolean => useSession().status === 'authenticated';

export const useIsAuthReady = (): boolean => useSession().status !== 'loading';

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

  const { status: sessionStatus } = useSession();

  const keys = useMemo(() => resources.map((resource) => makeResourceKey(resource)), [resources]);

  const resourcePermissions = useSelector((state: RootState) => state.auth.resourcePermissions);

  useEffect(() => {
    const anyFetching = keys.some((key) => !!resourcePermissions[key]?.isFetching);
    const allHavePermissions = keys.every((key) => !!resourcePermissions[key]?.permissions?.length);
    const allAttempted = keys.every((key) => !!resourcePermissions[key]?.hasAttempted);

    // If the session is still loading, or any permissions are currently fetching, or all requested permissions have
    // already been tried/returned, we don't need to dispatch the fetch action:
    if (!authzUrl || sessionStatus === 'loading' || anyFetching || allHavePermissions || allAttempted) return;

    dispatch(fetchResourcesPermissions({ resources, authzUrl }));
  }, [dispatch, keys, resources, resourcePermissions, authzUrl, sessionStatus]);

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

export const useHandleRefreshTokenError = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === 'RefreshTokenError') {
      signIn(BENTO_OIDC_PROVIDER_ID);
    }
  }, [session?.error]);
};

export const usePerformSignOut = () =>
  useCallback(async () => {
    try {
      // The server builds the end-session URL, since only it can read the ID token (for id_token_hint).
      const res = await fetch('/api/auth/end-session-url');
      if (res.ok) {
        const { endSessionUrl } = (await res.json()) as { endSessionUrl: string | null };
        if (endSessionUrl) {
          await signOut({ redirect: false }); // clear our own session first - the URL has been built already
          window.location.href = endSessionUrl; // ...then hand off to the identity provider to end its session too
          return;
        }
      }
    } catch (err) {
      console.error('Error building identity provider end-session URL', err);
    }
    // Fallback: provider doesn't support RP-initiated logout, or discovery failed.
    await signOut();
  }, []);
