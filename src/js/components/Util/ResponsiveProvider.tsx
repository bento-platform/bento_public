import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { DeviceBreakpoints } from '@/constants/deviceBreakpoints';

interface ResponsiveContextType {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
}

const WIDTH_NEAREST_N = 20;
const roundedInnerWidth = () => Math.round(window.innerWidth / WIDTH_NEAREST_N) * WIDTH_NEAREST_N;

const DefaultResponsiveContext: ResponsiveContextType = {
  width: roundedInnerWidth(),
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
  // Use nearest 20px to prevent over-frequent updates
  const [width, setWidth] = useState<number>(roundedInnerWidth());
  const [isMobile, setIsMobile] = useState<boolean>(isMobileLogic(window.innerWidth));
  const [isTablet, setIsTablet] = useState<boolean>(isTabletLogic(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setWidth(roundedInnerWidth());
      setIsMobile(isMobileLogic(window.innerWidth));
      setIsTablet(isTabletLogic(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <ResponsiveContext.Provider value={{ width, isMobile, isTablet }}>{children}</ResponsiveContext.Provider>;
};

export default ResponsiveProvider;
