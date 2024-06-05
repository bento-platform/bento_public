import { BentoRoutes } from '@/types/routes';

export const getCurrentPage = (): string => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.keys(BentoRoutes);
  if (pathArray.length > 2 && validPages.includes(pathArray[2])) {
    return pathArray[2];
  } else {
    return 'overview';
  }
};
