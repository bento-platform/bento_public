import { use } from 'react';
import { ResponsiveContext } from '@/components/Util/ResponsiveProvider';

export const useResponsiveMobileContext = (): boolean => {
  return use(ResponsiveContext).isMobile;
};

export const useResponsiveTabletContext = (): boolean => {
  return use(ResponsiveContext).isTablet;
};

export const useSmallScreen = (): boolean => {
  const { isMobile, isTablet } = use(ResponsiveContext);
  return isMobile || isTablet;
};

export const useInnerWidth = (): number => use(ResponsiveContext).width;
