import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useNavigateToRoot = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return useCallback(() => navigate(`/${i18n.language}`), [navigate, i18n.language]);
};
