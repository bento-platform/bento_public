import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// refer to https://react-redux.js.org/using-react-redux/usage-with-typescript#define-typed-hooks for more info
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ################### TRANSLATION HOOKS ###################
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { NamespaceTranslationFunction } from '@/types/translation';
import { RESOURCE_EVERYTHING, Resource, queryData, useHasResourcePermission } from 'bento-auth-js';
import { useEffect } from 'react';
import { setMaxQueryParametersRequired } from './features/config/config.store';

export const useTranslationDefault = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

export const useTranslationCustom = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

// ################### AUTH/AUTHZ HOOKS ###################

export const useHasResourcePermissionWrapper = (resource: Resource, permission: string) => {
  const authzUrl = useAppSelector((state) => state.config.serviceInfo.auth);

  const { isFetching: fetchingPermission, hasPermission } = useHasResourcePermission(resource, authzUrl, permission);

  return {
    fetchingPermission,
    hasPermission,
  };
};

export const useBeaconWithAuthIfAllowed = () => {
  const dispatch = useAppDispatch();
  const { hasPermission } = useHasResourcePermissionWrapper(RESOURCE_EVERYTHING, queryData);
  useEffect(() => {
    if (hasPermission) {
      console.log("Beacon: user authorized for no max query parameters.");
      dispatch(setMaxQueryParametersRequired(false));
    }
  }, [dispatch, hasPermission]);
};
