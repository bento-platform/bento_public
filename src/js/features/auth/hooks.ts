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
export type ResourcePermissionsState = BaseResourcePermissionsState & { permissions: string[] };
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

const AUTH_RETRY_PARAM = 'auth_retry';
const SIGN_IN_LOCK = 'bento-auto-signin';
const SIGN_IN_STARTED_KEY = 'bento-auto-signin-started-at';
// How long a started sign-in blocks other tabs from starting their own. Long enough for a user to type credentials.
const SIGN_IN_IN_PROGRESS_MS = 2 * 60 * 1000;

const readSignInStartedAt = (): number => {
  try {
    return Number(localStorage.getItem(SIGN_IN_STARTED_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeSignInStartedAt = (value: number | undefined) => {
  try {
    if (value === undefined) localStorage.removeItem(SIGN_IN_STARTED_KEY);
    else localStorage.setItem(SIGN_IN_STARTED_KEY, String(value));
  } catch {
    // Storage is unavailable: tabs cannot coordinate, so each one signs in on its own.
  }
};

// Auth.js stores its OAuth `state` in one cookie shared by every tab. If two tabs (or two effects) start sign-in at
// the same time, the second flow overwrites the cookie and the first callback fails with InvalidCheck. So only one
// auto sign-in may start at a time. The Web Lock makes the check-and-set atomic across tabs; the localStorage
// timestamp remembers that a sign-in is in progress after the lock is released (the page navigates away).
const startAutoSignIn = async (force: boolean) => {
  const start = () => {
    if (!force && Date.now() - readSignInStartedAt() < SIGN_IN_IN_PROGRESS_MS) return;
    writeSignInStartedAt(Date.now());
    return signIn(BENTO_OIDC_PROVIDER_ID);
  };
  if (typeof navigator !== 'undefined' && navigator.locks) {
    await navigator.locks.request(SIGN_IN_LOCK, async () => {
      await start();
    });
  } else {
    await start();
  }
};

export const useHandleRefreshTokenError = () => {
  const { data: session, status } = useSession();
  const error = session?.error;

  useEffect(() => {
    if (error === 'RefreshTokenError') {
      // The auth error route sends users back with this param after a failed callback (e.g. the state cookie expired
      // while the Keycloak login page was open). The previous sign-in is over, so retry despite the in-progress guard.
      const params = new URLSearchParams(window.location.search);
      const force = params.has(AUTH_RETRY_PARAM);
      if (force) {
        params.delete(AUTH_RETRY_PARAM);
        const query = params.toString();
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
        );
      }
      startAutoSignIn(force);
    } else if (status === 'authenticated') {
      // Signed in with a healthy session (possibly via another tab): the next expiry may auto sign in again.
      writeSignInStartedAt(undefined);
    }
  }, [error, status]);
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
