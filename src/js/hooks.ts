import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useHasResourcePermission, useResourcePermissions, Resource } from 'bento-auth-js';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// refer to https://react-redux.js.org/using-react-redux/usage-with-typescript#define-typed-hooks for more info
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ################### TRANSLATION HOOKS ###################
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { NamespaceTranslationFunction } from '@/types/translation';

const useTranslationDefault = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

const useTranslationCustom = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

export { useTranslationDefault, useTranslationCustom };

// AUTHORIZATION:
// Wrapper hooks for bento-auth-js permissions hooks, which expect a 'authzUrl' argument.
// bento-auth-js does not assume that the 'authzUrl' is accessible from the store (left to the client app to provide).
// These wrapper hooks grab the 'authzUrl' from the store's services.

/**
 * The evaluation of a user permission for a given resource.
 * @typedef {Object} ResourcePermissionEval
 * @property {boolean} fetchingPermission Indicates the permission is being fetched from the authz service.
 * @property {boolean} hasPermission Indicates the user has the requested resource permission.
 */

/**
 * The user permissions for a given resource
 * @typedef {Object} ResourcePermissions
 * @property {string[]} permissions The list of permissions the user has on the resource
 * @property {boolean} isFetchingPermissions Indicates if the permissions are being fetched.
 * @property {boolean} hasAttemptedPermissions Indicates if a permissions fetch was attempted.
 */

/**
 * Evaluate if the user has a permission on a given resource
 * @param {Object} resource The resource key (e.g. "everything")
 * @param {string} permission The permission string (e.g. "view:drop_box")
 * @returns {ResourcePermissionEval}
 */
export const useHasResourcePermissionWrapper = (resource: Resource, permission: string) => {
  const authzUrl = useAppSelector((state) => state.config.serviceInfo.auth);

  const { isFetching: fetchingPermission, hasPermission } = useHasResourcePermission(resource, authzUrl, permission);

  return {
    fetchingPermission,
    hasPermission,
  };
};

/**
 * Returns the user's permissions for a given resource
 * @param {string} resource The resource (e.g. "everything")
 * @returns {ResourcePermissions}
 */
export const useResourcePermissionsWrapper = (resource: Resource) => {
  const authzUrl = useAppSelector((state) => state.config.serviceInfo.auth);

  const {
    permissions,
    isFetching: isFetchingPermissions,
    hasAttempted: hasAttemptedPermissions,
  } = useResourcePermissions(resource, authzUrl);

  return {
    permissions,
    isFetchingPermissions,
    hasAttemptedPermissions,
  };
};
