import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { Resource } from 'bento-auth-js';
import { RESOURCE_EVERYTHING, queryData, useHasResourcePermission } from 'bento-auth-js';

import type { RootState, AppDispatch } from '@/store';
import { CUSTOMIZABLE_TRANSLATION } from '@/constants/configConstants';
import type { NamespaceTranslationFunction } from '@/types/translation';
import { useSelectedScopeAsResource } from '@/features/metadata/hooks';
import { CHART_WIDTH, GRID_GAP } from '@/constants/overviewConstants';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// refer to https://react-redux.js.org/using-react-redux/usage-with-typescript#define-typed-hooks for more info
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ################### TRANSLATION HOOKS ###################

export const useTranslationFn = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(CUSTOMIZABLE_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

// ################### AUTH/AUTHZ HOOKS ###################

export const useHasResourcePermissionWrapper = (resource: Resource, permission: string) => {
  const authzUrl = useAppSelector((state) => state.config.serviceInfo.auth);

  const {
    isFetching: fetchingPermission,
    hasAttempted,
    hasPermission,
  } = useHasResourcePermission(resource, authzUrl, permission);

  return {
    fetchingPermission,
    hasAttempted,
    hasPermission,
  };
};

export const useHasScopePermission = (permission: string) => {
  const scopeResource = useSelectedScopeAsResource();
  return useHasResourcePermissionWrapper(scopeResource, permission);
};

export const useQueryWithAuthIfAllowed = () => {
  const dispatch = useAppDispatch();
  const { hasPermission } = useHasResourcePermissionWrapper(RESOURCE_EVERYTHING, queryData);
  useEffect(() => {
    if (hasPermission) {
      console.log('Beacon | Search: user authorized for query:data.');
    }
  }, [dispatch, hasPermission]);
};
