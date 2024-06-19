import { BentoRoute } from '@/types/routes';

export const getCurrentPage = (): BentoRoute => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.values(BentoRoute);
  if (pathArray.length > 2 && validPages.includes(pathArray[2] as BentoRoute)) {
    return pathArray[2] as BentoRoute;
  } else {
    return BentoRoute.Overview;
  }
};
