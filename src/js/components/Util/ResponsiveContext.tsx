import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

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

const isMobileLogic = (width: number) => width <= DeviceBreakpoints.MOBILE;
const isTabletLogic = (width: number) => width > DeviceBreakpoints.MOBILE && width <= DeviceBreakpoints.TABLET;

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(isMobileLogic(window.innerWidth));
  const [isTablet, setIsTablet] = useState<boolean>(isTabletLogic(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileLogic(window.innerWidth));
      setIsTablet(isTabletLogic(window.innerWidth));
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
  const { isMobile, isTablet } = useContext(ResponsiveContext);
  return isMobile || isTablet;
};
