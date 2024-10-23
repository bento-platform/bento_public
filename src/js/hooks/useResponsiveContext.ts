import { useContext } from 'react';
import { ResponsiveContext } from '@/components/Util/responsiveUtils';

export const useResponsiveMobileContext = (): boolean => {
  return useContext(ResponsiveContext).isMobile;
};

export const useResponsiveTabletContext = (): boolean => {
  return useContext(ResponsiveContext).isTablet;
};

export const useSmallScreen = (): boolean => {
  const { isMobile, isTablet } = useContext(ResponsiveContext);
  return isMobile || isTablet;
};
