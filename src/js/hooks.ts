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

const useTranslationDefault = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

const useTranslationCustom = (): NamespaceTranslationFunction => {
  const { t } = useTranslation(NON_DEFAULT_TRANSLATION);

  return t as NamespaceTranslationFunction;
};

export { useTranslationDefault, useTranslationCustom };
