import { useMemo } from 'react';
import { useAppSelector, useLanguage } from '@/hooks';

export const useAboutContent = () => {
  const language = useLanguage();
  const { status: aboutStatus, about } = useAppSelector((state) => state.content);
  const aboutContent = useMemo(() => about[language].trim(), [about, language]);
  return [aboutContent, aboutStatus];
};
