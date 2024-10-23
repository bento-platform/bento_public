import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { DeviceBreakpoints } from '@/constants/deviceBreakpoints';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
}

const DefaultResponsiveContext: ResponsiveContextType = {
  isMobile: false,
  isTablet: false,
};

export const ResponsiveContext = createContext<ResponsiveContextType>(DefaultResponsiveContext);

const isMobileLogic = (width: number) => width <= DeviceBreakpoints.MOBILE;
const isTabletLogic = (width: number) => width > DeviceBreakpoints.MOBILE && width <= DeviceBreakpoints.TABLET;

interface ResponsiveProviderProps {
  children: ReactNode;
}

const ResponsiveProvider = ({ children }: ResponsiveProviderProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(isMobileLogic(window.innerWidth));
  const [isTablet, setIsTablet] = useState<boolean>(isTabletLogic(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileLogic(window.innerWidth));
      setIsTablet(isTabletLogic(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <ResponsiveContext.Provider value={{ isMobile, isTablet }}>{children}</ResponsiveContext.Provider>;
};

export default ResponsiveProvider;
