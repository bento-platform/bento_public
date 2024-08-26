import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { Resource } from 'bento-auth-js';
import { RESOURCE_EVERYTHING, queryData, useHasResourcePermission } from 'bento-auth-js';

import type { RootState, AppDispatch } from '@/store';
import { DEFAULT_TRANSLATION, NON_DEFAULT_TRANSLATION } from '@/constants/configConstants';
import type { NamespaceTranslationFunction } from '@/types/translation';
import { setMaxQueryParametersRequired } from '@/features/config//config.store';
import { CHART_WIDTH, GRID_GAP } from '@/constants/overviewConstants';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// refer to https://react-redux.js.org/using-react-redux/usage-with-typescript#define-typed-hooks for more info
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ################### TRANSLATION HOOKS ###################

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

export const useQueryWithAuthIfAllowed = () => {
  const dispatch = useAppDispatch();
  const { hasPermission } = useHasResourcePermissionWrapper(RESOURCE_EVERYTHING, queryData);
  useEffect(() => {
    if (hasPermission) {
      console.log('Beacon | Search: user authorized for no max query parameters.');
      dispatch(setMaxQueryParametersRequired(false));
    }
  }, [dispatch, hasPermission]);
};

// ################### OVERFLOW HOOKS ###################
function isElementOutOfView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.right + 64 > window.innerWidth;
}

function isSpaceAvailable(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.right + CHART_WIDTH + GRID_GAP + 64 < window.innerWidth;
}

export const useElementWidth = (ref: React.RefObject<HTMLElement>, initialWidth: number) => {
  const [width, setWidth] = useState(initialWidth);

  const adjustWidth = useCallback(() => {
    if (ref.current) {
      if (initialWidth < width) {
        setWidth(initialWidth);
      } else if (isElementOutOfView(ref.current)) {
        setWidth((prevWidth) => Math.max(prevWidth - 1, 1));
      } else if (width < initialWidth && isSpaceAvailable(ref.current)) {
        setWidth((prevWidth) => Math.min(prevWidth + 1, initialWidth));
      }
    }
  }, [ref, width, initialWidth]);

  useEffect(() => {
    adjustWidth();
  }, [adjustWidth, initialWidth]);

  useEffect(() => {
    const handleResize = debounceAdjustWidth(adjustWidth, 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustWidth]);

  return width;
};

function debounceAdjustWidth(callback: () => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };
}
