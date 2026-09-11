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

// window isn't available during SSR, so this - and ResponsiveProvider's initial state below - fall back to a
// desktop-sized default for the first (server-rendered) paint; the effect below syncs the real value immediately
// on mount, so this only ever affects that first paint, not steady-state behaviour.
const SSR_DEFAULT_WIDTH = 1280;

const DefaultResponsiveContext: ResponsiveContextType = {
  width: SSR_DEFAULT_WIDTH,
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
  const [width, setWidth] = useState<number>(SSR_DEFAULT_WIDTH);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(roundedInnerWidth());
      setIsMobile(isMobileLogic(window.innerWidth));
      setIsTablet(isTabletLogic(window.innerWidth));
    };
    handleResize(); // Sync to the real client width immediately on mount (the state above starts at the SSR default).
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <ResponsiveContext.Provider value={{ width, isMobile, isTablet }}>{children}</ResponsiveContext.Provider>;
};

export default ResponsiveProvider;
