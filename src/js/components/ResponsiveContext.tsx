import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { DeviceBreakpoints } from '@/constants/deviceBreakpoints';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
}

const DefaultResponsiveContext: ResponsiveContextType = {
  isMobile: false,
  isTablet: false,
};

const ResponsiveContext = createContext<ResponsiveContextType>(DefaultResponsiveContext);

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= DeviceBreakpoints.MOBILE);
      setIsTablet(window.innerWidth > DeviceBreakpoints.MOBILE && window.innerWidth <= DeviceBreakpoints.TABLET);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <ResponsiveContext.Provider value={{ isMobile, isTablet }}>{children}</ResponsiveContext.Provider>;
};

export const useResponsiveMobileContext = (): boolean => {
  return useContext(ResponsiveContext).isMobile;
};

export const useResponsiveTabletContext = (): boolean => {
  return useContext(ResponsiveContext).isTablet;
};

export const useSmallScreen = (): boolean => {
  return useContext(ResponsiveContext).isMobile || useContext(ResponsiveContext).isTablet;
};
