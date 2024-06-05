import { BentoRoutes } from '@/types/routes';

export const getCurrentPage = (): string => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.values(BentoRoutes);
  if (pathArray.length > 2 && validPages.includes(pathArray[2] as BentoRoutes)) {
    return pathArray[2];
  } else {
    return 'overview';
  }
};
