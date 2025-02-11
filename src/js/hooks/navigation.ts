import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FORCE_CATALOGUE } from '@/config';
import { useMetadata } from '@/features/metadata/hooks';

export const useNavigateToRoot = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return useCallback(() => navigate(`/${i18n.language}`), [navigate, i18n.language]);
};

export const useIsInCatalogueMode = () => {
  const { projects } = useMetadata();
  return projects.length !== 1 || FORCE_CATALOGUE;
};
