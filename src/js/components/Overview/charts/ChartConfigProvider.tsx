import React, { useContext } from 'react';

import { COLORS, defaultTranslationObject } from './chartConstants';
import { ChartTheme, LngDictionary, SupportedLng, TranslationObject } from './chartTypes';

const ChartThemeContext = React.createContext<ChartTheme<any>>({
  default: COLORS,
});
export const useChartTheme = () => useContext(ChartThemeContext);

const ChartTranslationContext = React.createContext<LngDictionary>(defaultTranslationObject.en);
export const useChartTranslation = () => useContext(ChartTranslationContext);

export const ChartConfigProvider = ({
  theme = useChartTheme(),
  Lng,
  translationMap,
  children,
}: {
  theme?: ChartTheme<any>;
  Lng: SupportedLng;
  translationMap?: TranslationObject;
  children: React.ReactElement;
}) => {
  return (
    <ChartThemeContext.Provider value={theme}>
      <ChartTranslationContext.Provider value={translationMap ? translationMap[Lng] : defaultTranslationObject[Lng]}>
        {children}
      </ChartTranslationContext.Provider>
    </ChartThemeContext.Provider>
  );
};
